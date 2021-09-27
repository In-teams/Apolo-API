import { Request } from 'express';
import db from '../config/db';
import DateFormat from '../helpers/DateFormat';

class Redeem {
	getPoint(req: Request): any {
		const {
			distributor_id,
			outlet_id,
			area_id,
			region_id,
			wilayah_id,
			ass_id,
			asm_id,
			salesman_id,
			quarter_id,
			month_id
		} = req.validated;
		const query = db()
			.select('')
			.sum('trb.point_satuan as perolehan')
			.from('trx_transaksi as tr')
			.innerJoin(
				'trx_transaksi_barang as trb',
				'tr.kd_transaksi',
				'trb.kd_transaksi'
			)
			.innerJoin('mstr_outlet as o', 'tr.no_id', 'o.outlet_id')
			.innerJoin('ms_pulau_alias as r', 'o.region_id', 'r.pulau_id_alias')
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			// .innerJoin("ms_user_scope", "mstr_outlet.outlet_id", "ms_user_scope.scope")
			// .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
			.where({
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.city_id_alias': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			});
			if(quarter_id) query.whereRaw('MONTH(tr.tgl_transaksi) IN(?)', [quarter_id])
			if(month_id) query.whereRaw('MONTH(tr.tgl_transaksi) = ?', [month_id])
		return query;
	}
	getPointRedeem(req: Request): any {
		const {
			distributor_id,
			outlet_id,
			area_id,
			region_id,
			wilayah_id,
			ass_id,
			asm_id,
			salesman_id,
			quarter_id,
			month_id
		} = req.validated;
		const query = db()
			.select(db().raw('SUM(trrb.point_satuan * trrb.quantity) as redeem'))
			.from('trx_transaksi_redeem as trr')
			.innerJoin(
				'trx_transaksi_redeem_barang as trrb',
				'trr.kd_transaksi',
				'trrb.kd_transaksi'
			)
			.innerJoin('mstr_outlet as o', 'trr.no_id', 'o.outlet_id')
			.innerJoin('ms_pulau_alias as r', 'o.region_id', 'r.pulau_id_alias')
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			// .innerJoin("ms_user_scope", "mstr_outlet.outlet_id", "ms_user_scope.scope")
			// .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
			.where({
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.city_id_alias': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			});
			if(quarter_id) query.whereRaw('MONTH(trr.tgl_transaksi) IN(?)', [quarter_id])
			if(month_id) query.whereRaw('MONTH(trr.tgl_transaksi) = ?', [month_id])
		return query;
	}
	getPointSummary(req: Request): any {
		const {
			distributor_id,
			outlet_id,
			area_id,
			region_id,
			wilayah_id,
			ass_id,
			asm_id,
			salesman_id,
		} = req.validated;
		const query = db()
			.distinct(
				this.getPoint(req).as('achieve'),
				this.getPointRedeem(req).as('redeem')
			)
			.from('mstr_outlet as o')
			.innerJoin('ms_pulau_alias as r', 'o.region_id', 'r.pulau_id_alias')
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			// .innerJoin("ms_user_scope", "mstr_outlet.outlet_id", "ms_user_scope.scope")
			// .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
			.where({
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.city_id_alias': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			});
		// console.log(query.toSQL().sql);
		return query;
	}
	getPointSummaryByHR(req: Request): any {
		const {
			distributor_id,
			outlet_id,
			area_id,
			region_id,
			wilayah_id,
			ass_id,
			asm_id,
			salesman_id,
			sort,
		} = req.validated;
		const query = db()
			.select(
				'hr.head_region_name as wilayah',
				this.getPoint(req)
					.where('r.head_region_id', '=', db().raw('hr.head_region_id'))
					.as('achieve'),
				this.getPointRedeem(req)
					.where('r.head_region_id', '=', db().raw('hr.head_region_id'))
					.as('redeem')
			)
			.from('mstr_outlet as o')
			.innerJoin('ms_pulau_alias as r', 'o.region_id', 'r.pulau_id_alias')
			.innerJoin(
				'ms_head_region as hr',
				'r.head_region_id',
				'hr.head_region_id'
			)
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			// .innerJoin("ms_user_scope", "mstr_outlet.outlet_id", "ms_user_scope.scope")
			// .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
			.where({
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.city_id_alias': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			})
			.groupBy('wilayah')
			.orderBy('achieve', sort);
		// console.log(query.toSQL().sql);
		return query;
	}
	async post(req: Request): Promise<any> {
		try {
			const { outlet_id, filename } = req.validated;
			return await db().transaction(async (trx) => {
				const insert = await trx('trx_file_penukaran').insert({
					outlet_id,
					filename,
				});

				await trx('trx_history_penukaran').insert({
					outlet_id,
					file_id: insert[0],
				});
			});
		} catch (error) {
			console.log(error);
		}
	}
	async validation(req: Request): Promise<any> {
		try {
			const { status_penukaran, id, outlet_id } = req.validated;
			return await db().transaction(async (trx) => {
				await trx('trx_file_penukaran')
					.where({ id })
					.update({
						status_penukaran,
						validated_at: DateFormat.getToday('YYYY-MM-DD HH:mm:ss'),
					});
				await trx('trx_history_penukaran').insert({
					outlet_id,
					status_penukaran,
					file_id: id,
				});
			});
		} catch (error) {
			console.log(error);
		}
	}
	update(req: Request): any {
		const { id } = req.validated;
		delete req.validated.id;
		return db()('trx_file_penukaran').where({ id }).update(req.validated);
	}
	getRedeemForm(req: Request): any {
		const { outlet_id } = req.validated;
		return db()
			.select('*')
			.from('trx_file_penukaran')
			.where({ outlet_id })
			.andWhereRaw('MONTH(uploaded_at) = ?', [new Date().getMonth() + 1]);
	}
	getLastTrCode(): any {
		return db()("trx_transaksi_redeem").max('kd_transaksi as kd_transaksi')
	}
	getProduct(req: Request): any {
		const { point, product_id, category } = req.validated;
		const query = db()
			.select('mp.product_id', 'mp.product_name', 'mpb.point', 'mp.category')
			.from('ms_product as mp')
			.innerJoin('ms_program_barang as mpb', 'mp.product_id', 'mpb.product_id')
			.where({
				...(category && { category }),
			});
		if (point) query.whereRaw('point <= ?', [point]);
		if (product_id) query.whereIn('mp.product_id', product_id);

		return query;
	}
	async checkout(req: Request): Promise<any> {
		try {
		  return await db().transaction(async (trx) => {
			await trx("trx_transaksi_redeem").insert(req.validated.data)
			await trx("trx_transaksi_redeem_barang").insert(req.validated.detail)
		  });
		  // return db()("trx_file_registrasi").insert(req.validated);
		} catch (error) {
		  console.log(error, "<<<");
		}
	  }
}

export default new Redeem();
