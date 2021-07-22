import { Request } from 'express';
import db from '../config/db';
import OutletService from './Outlet';

class Sales {
	getTarget(req: Request): any {
		const {
			outlet_id,
			area_id,
			wilayah_id,
			distributor_id,
			region_id,
			month,
			ass_id,
			asm_id,
			salesman_id,
		} = req.validated;
		const query = db()
			.select()
			.sum('st.target_sales as total')
			.from('ms_sales_target as st')
			.innerJoin('ms_outlet as o', 'st.outlet_id', 'o.outlet_id')
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			.innerJoin('ms_region as r', 'o.region_id', 'r.region_id')
			.innerJoin(
				'ms_head_region as hr',
				'r.head_region_id',
				'hr.head_region_id'
			)
			// .innerJoin("ms_user_scope", "ms_outlet.outlet_id", "ms_user_scope.scope")
			// .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
			.where({
				...(month && { month_target: month }),
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.area_id': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			});
		// console.log(query.toSQL().toNative());
		return query;
	}
	getAktual(req: Request): any {
		const {
			outlet_id,
			area_id,
			wilayah_id,
			distributor_id,
			region_id,
			month,
			ass_id,
			asm_id,
			salesman_id,
		} = req.validated;
		const query = db()
			.select()
			.sum('trb.sales as total')
			.from('trx_transaksi as tr')
			.innerJoin(
				'trx_transaksi_barang as trb',
				'tr.kd_transaksi',
				'trb.kd_transaksi'
			)
			.innerJoin('ms_outlet as o', 'tr.no_id', 'o.outlet_id')
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			.innerJoin('ms_region as r', 'o.region_id', 'r.region_id')
			.innerJoin(
				'ms_head_region as hr',
				'r.head_region_id',
				'hr.head_region_id'
			)
			// .innerJoin("ms_user_scope", "ms_outlet.outlet_id", "ms_user_scope.scope")
			// .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
			.where({
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.area_id': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			});
		if (month) query.andWhereRaw('MONTHNAME(tr.tgl_transaksi) = ?', [month]);

		return query;
	}
	getSummaryByHR(req: Request): any {
		const {
			outlet_id,
			area_id,
			wilayah_id,
			distributor_id,
			region_id,
			month,
			ass_id,
			asm_id,
			salesman_id,
			sort,
		} = req.validated;
		const query = db()
			.select(
				'mhr.head_region_name as wilayah',
				this.getAktual(req)
					.where('r.head_region_id', '=', db().raw('mhr.head_region_id'))
					.as('aktual'),
				this.getTarget(req)
					.where('r.head_region_id', '=', db().raw('mhr.head_region_id'))
					.as('target')
			)
			.from('ms_outlet as o')
			.innerJoin('ms_region as r', 'o.region_id', 'r.region_id')
			.innerJoin(
				'ms_head_region as mhr',
				'r.head_region_id',
				'mhr.head_region_id'
			)
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			// .innerJoin("ms_user_scope", "o.outlet_id", "ms_user_scope.scope")
			// .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
			.where({
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.area_id': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			});
		if (month)
			query.andWhereRaw('MONTHNAME(trx_transaksi.tgl_transaksi) = ?', [month]);
		query.groupBy('wilayah').orderBy('aktual', sort);
		return query;
	}
	getSummaryByASM(req: Request): any {
		const {
			outlet_id,
			area_id,
			wilayah_id,
			distributor_id,
			region_id,
			month,
			ass_id,
			asm_id,
			salesman_id,
			sort,
		} = req.validated;
		const query = db()
			.select(
				'mp.nama_pic as nama_pic',
				this.getAktual(req)
					.where('pic.asm_id', '=', db().raw('mp.kode_pic'))
					.as('aktual'),
				this.getTarget(req)
					.where('pic.asm_id', '=', db().raw('mp.kode_pic'))
					.as('target')
			)
			.from('ms_outlet as o')
			.innerJoin('ms_region as r', 'o.region_id', 'r.region_id')
			.innerJoin(
				'ms_head_region as mhr',
				'r.head_region_id',
				'mhr.head_region_id'
			)
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			.innerJoin('ms_pic as mp', 'pic.asm_id', 'mp.kode_pic')
			// .innerJoin("ms_user_scope", "o.outlet_id", "ms_user_scope.scope")
			// .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
			.where({
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.area_id': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			});
		if (month)
			query.andWhereRaw('MONTHNAME(trx_transaksi.tgl_transaksi) = ?', [month]);
		query.groupBy('nama_pic').orderBy('aktual', sort).limit(5);
		return query;
	}
	getSummaryByCluster(req: Request): any {
		const {
			outlet_id,
			area_id,
			wilayah_id,
			distributor_id,
			region_id,
			month,
			ass_id,
			asm_id,
			salesman_id,
			sort,
		} = req.validated;
		const query = db()
			.select(
				'mst.target_annual',
				'o.outlet_id',
				db().raw(
					"SUM(trb.sales) as sales, CASE when round((sum(trb.sales)/mst.target_annual) * 100, 5) < 25 or trb.sales is null then '0% - 25%' WHEN ROUND((SUM(trb.sales)/mst.target_annual) * 100, 5) >= 25 and ROUND((SUM(trb.sales)/mst.target_annual) * 100, 5) < 50 then '25% - 50%' WHEN ROUND((SUM(trb.sales)/mst.target_annual) * 100, 5) >= 50 and ROUND((SUM(trb.sales)/mst.target_annual) * 100, 5) < 75 THEN '50% - 75%' WHEN ROUND((SUM(trb.sales)/mst.target_annual) * 100, 5) >= 75 AND ROUND((SUM(trb.sales)/mst.target_annual) * 100, 5) < 95 THEN '75% - 95%' WHEN ROUND((SUM(trb.sales)/mst.target_annual) * 100, 5) >= 95 AND ROUND((SUM(trb.sales)/mst.target_annual) * 100, 5) < 100 THEN '95% - 100%' else '>= 100%' end as cluster"
				)
			)
			.from('ms_outlet as o')
			.leftJoin('trx_transaksi as tr', 'tr.no_id', 'o.outlet_id')
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			.innerJoin('ms_region as r', 'o.region_id', 'r.region_id')
			.innerJoin(
				'ms_head_region as hr',
				'r.head_region_id',
				'hr.head_region_id'
			)
			.innerJoin(
				'trx_transaksi_barang as trb',
				'trb.kd_transaksi',
				'tr.kd_transaksi'
			)
			.innerJoin(
				db()
					.select('mst.outlet_id')
					.sum('mst.target_sales as target_annual')
					.from('ms_sales_target as mst')
					.innerJoin('ms_outlet as o', 'o.outlet_id', 'mst.outlet_id')
					.where({
						...(month && { month_target: month }),
						...(outlet_id && { 'o.outlet_id': outlet_id }),
						...(area_id && { 'o.area_id': area_id }),
						...(region_id && { 'o.region_id': region_id }),
						...(distributor_id && { 'o.distributor_id': distributor_id }),
						...(wilayah_id && { 'r.head_region_id': wilayah_id }),
						...(ass_id && { 'pic.ass_id': ass_id }),
						...(asm_id && { 'pic.asm_id': asm_id }),
					})
					.groupBy('outlet_id')
					.as('mst'),
				'mst.outlet_id',
				'o.outlet_id'
			)
			.where({
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.area_id': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
			});
		month && query.whereRaw('MONTHNAME(tr.tgl_transaksi) = ?', [month]);
		query.groupBy('outlet_id');
		query.as('custom');
		return query;
	}
	getSummaryByAchieve(req: Request): any {
		const query = db()
			.select('cluster')
			.sum('target_annual as target')
			.sum('sales as aktual')
			.count('outlet_id as outlet')
			.from(this.getSummaryByCluster(req))
			.groupBy('cluster');
		return query;
	}
	getSummary(req: Request): any {
		const {
			outlet_id,
			area_id,
			wilayah_id,
			distributor_id,
			region_id,
			month,
			ass_id,
			asm_id,
			salesman_id,
		} = req.validated;
		const query = db()
			.distinct(
				this.getAktual(req).as('aktual'),
				this.getTarget(req).as('target'),
				OutletService.getOutletCount(req).as('total_outlet')
			)
			.from('ms_outlet as o')
			.innerJoin('ms_region as r', 'o.region_id', 'r.region_id')
			.innerJoin(
				'ms_head_region as mhr',
				'r.head_region_id',
				'mhr.head_region_id'
			)
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			// .innerJoin("ms_user_scope", "o.outlet_id", "ms_user_scope.scope")
			// .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
			.where({
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.area_id': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			});
		// if (month)
		//   query.andWhereRaw("MONTHNAME(trx_transaksi.tgl_transaksi) = ?", [month]);
		// console.log(query.toSQL().toNative().sql);
		// console.log(query.toSQL().toNative().sql);
		return query;
	}
	getSummaryPerQuarter(req: Request) {
		const {
			outlet_id,
			area_id,
			wilayah_id,
			distributor_id,
			region_id,
			month,
			ass_id,
			asm_id,
			salesman_id,
			quarter_id,
		} = req.validated;
		const query = db()
			.select(
				'b.id as bulan_id',
				'b.bulan as bulan',
				'target',
				'aktual',
				'poin'
			)
			.from('ms_bulan as b')
			.leftJoin(
				db()
					.select('bulan_id', 'target', 'aktual', 'poin')
					.from('ms_outlet as o')
					.innerJoin(
						db()
							.select('st.outlet_id', 'month_target')
							.sum('target_sales as target')
							.from('ms_sales_target as st')
							.innerJoin('ms_outlet as o', 'o.outlet_id', 'st.outlet_id')
							.innerJoin('ms_region as r', 'o.region_id', 'r.region_id')

							.innerJoin(
								'ms_dist_pic as pic',
								'o.distributor_id',
								'pic.distributor_id'
							)
							.where({
								...(outlet_id && { 'o.outlet_id': outlet_id }),
								...(area_id && { 'o.area_id': area_id }),
								...(region_id && { 'o.region_id': region_id }),
								...(distributor_id && { 'o.distributor_id': distributor_id }),
								...(wilayah_id && { 'r.head_region_id': wilayah_id }),
								...(ass_id && { 'pic.ass_id': ass_id }),
								...(asm_id && { 'pic.asm_id': asm_id }),
								// ...(salesman_id && { "ms_user.user_id": salesman_id }),
							})
							.groupBy('month_target')
							.as('mst'),
						'mst.outlet_id',
						'o.outlet_id'
					)
					.innerJoin(
						db()
							.select(
								db().raw('MONTHNAME(tr.tgl_transaksi) as bulan'),
								db().raw('MONTH(tr.tgl_transaksi) as bulan_id')
							)
							.sum('sales as aktual')
							.sum('point_satuan as poin')
							.from('trx_transaksi_barang as trb')
							.innerJoin(
								'trx_transaksi as tr',
								'tr.kd_transaksi',
								'trb.kd_transaksi'
							)
							.innerJoin('ms_outlet as o', 'o.outlet_id', 'tr.no_id')
							.innerJoin('ms_region as r', 'o.region_id', 'r.region_id')

							.innerJoin(
								'ms_dist_pic as pic',
								'o.distributor_id',
								'pic.distributor_id'
							)
							.where({
								...(outlet_id && { 'o.outlet_id': outlet_id }),
								...(area_id && { 'o.area_id': area_id }),
								...(region_id && { 'o.region_id': region_id }),
								...(distributor_id && { 'o.distributor_id': distributor_id }),
								...(wilayah_id && { 'r.head_region_id': wilayah_id }),
								...(ass_id && { 'pic.ass_id': ass_id }),
								...(asm_id && { 'pic.asm_id': asm_id }),
								// ...(salesman_id && { "ms_user.user_id": salesman_id }),
							})
							.groupBy('bulan')
							.as('trb'),
						'trb.bulan',
						'month_target'
					)
					.as('sub'),
				'sub.bulan_id',
				'b.id'
			);
		quarter_id && query.whereIn('b.id', quarter_id);
		query.orderBy('b.id', 'asc');

		return query;
	}
	getSummaryPerSemester(req: Request) {
		const {
			outlet_id,
			area_id,
			wilayah_id,
			distributor_id,
			region_id,
			month,
			ass_id,
			asm_id,
			salesman_id,
			semester_id,
		} = req.validated;
		const query = db()
			.select(
				db().raw(`CASE WHEN b.id = 1 OR b.id = 2 OR b.id = 3 THEN '1'
			WHEN b.id = 4 OR b.id = 5 OR b.id = 6 THEN '2'
			WHEN b.id = 7 OR b.id = 8 OR b.id = 9 THEN '3'
			WHEN b.id = 10 OR b.id = 11 OR b.id = 12 THEN '4'
			END AS kuartal, sum(target) as target, sum(aktual) as aktual, sum(poin) as poin`)
			)
			.from('ms_bulan as b')
			.leftJoin(
				db()
					.select('bulan_id', 'target', 'aktual', 'poin')
					.from('ms_outlet as o')
					.innerJoin(
						db()
							.select('st.outlet_id', 'month_target')
							.sum('target_sales as target')
							.from('ms_sales_target as st')
							.innerJoin('ms_outlet as o', 'o.outlet_id', 'st.outlet_id')
							.innerJoin('ms_region as r', 'o.region_id', 'r.region_id')

							.innerJoin(
								'ms_dist_pic as pic',
								'o.distributor_id',
								'pic.distributor_id'
							)
							.where({
								...(outlet_id && { 'o.outlet_id': outlet_id }),
								...(area_id && { 'o.area_id': area_id }),
								...(region_id && { 'o.region_id': region_id }),
								...(distributor_id && { 'o.distributor_id': distributor_id }),
								...(wilayah_id && { 'r.head_region_id': wilayah_id }),
								...(ass_id && { 'pic.ass_id': ass_id }),
								...(asm_id && { 'pic.asm_id': asm_id }),
								// ...(salesman_id && { "ms_user.user_id": salesman_id }),
							})
							.groupBy('month_target')
							.as('mst'),
						'mst.outlet_id',
						'o.outlet_id'
					)
					.innerJoin(
						db()
							.select(
								db().raw('MONTHNAME(tr.tgl_transaksi) as bulan'),
								db().raw('MONTH(tr.tgl_transaksi) as bulan_id')
							)
							.sum('sales as aktual')
							.sum('point_satuan as poin')
							.from('trx_transaksi_barang as trb')
							.innerJoin(
								'trx_transaksi as tr',
								'tr.kd_transaksi',
								'trb.kd_transaksi'
							)
							.innerJoin('ms_outlet as o', 'o.outlet_id', 'tr.no_id')
							.innerJoin('ms_region as r', 'o.region_id', 'r.region_id')

							.innerJoin(
								'ms_dist_pic as pic',
								'o.distributor_id',
								'pic.distributor_id'
							)
							.where({
								...(outlet_id && { 'o.outlet_id': outlet_id }),
								...(area_id && { 'o.area_id': area_id }),
								...(region_id && { 'o.region_id': region_id }),
								...(distributor_id && { 'o.distributor_id': distributor_id }),
								...(wilayah_id && { 'r.head_region_id': wilayah_id }),
								...(ass_id && { 'pic.ass_id': ass_id }),
								...(asm_id && { 'pic.asm_id': asm_id }),
								// ...(salesman_id && { "ms_user.user_id": salesman_id }),
							})
							.groupBy('bulan')
							.as('trb'),
						'trb.bulan',
						'month_target'
					)
					.as('sub'),
				'sub.bulan_id',
				'b.id'
			);
		query.whereIn('b.id', semester_id);
		query.groupBy('kuartal');

		return query;
	}
}

export default new Sales();
