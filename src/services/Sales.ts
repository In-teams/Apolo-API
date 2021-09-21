import { Request } from 'express';
import db from '../config/db';
import OutletService from './Outlet';

class Sales {
	getTargetByAchieve(req: Request): any {
		const {
			outlet_id,
			area_id,
			wilayah_id,
			distributor_id,
			region_id,
			month_id,
			ass_id,
			asm_id,
			salesman_id,
			quarter_id,
		} = req.validated;
		const {scope, level} = req.body.decoded
		let addWhere : string = ''
		if(level === "4") addWhere = 'o.distributor_id'
		if(level === "2") addWhere = 'o.region_id'
		if(level === "3") addWhere = 'o.city_id_alias'
		if(level === "5") addWhere = 'o.outlet_id'
		const query = db()
			.select('st.outlet_id', 'b.id as bulan')
			.sum('st.target_sales as target_annual')
			.from(
				db()
					.select()
					.from('mstr_sales_target')
					.union([db().select('*').from('mstr_sales_target2')])
					.union([db().select('*').from('mstr_sales_target3')])
					.union([db().select('*').from('mstr_sales_target4')])
					.as('st')
			)
			.innerJoin('mstr_outlet as o', 'st.outlet_id', 'o.outlet_id')
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			.innerJoin('ms_pulau_alias as r', 'o.region_id', 'r.pulau_id_alias')
			.innerJoin(
				'ms_head_region as hr',
				'r.head_region_id',
				'hr.head_region_id'
			)
			.innerJoin('ms_bulan as b', 'month_target', 'b.bulan')
			// .innerJoin("ms_user_scope", "mstr_outlet.outlet_id", "ms_user_scope.scope")
			// .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
			.where({
				...(month_id && { 'b.id': month_id }),
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.city_id_alias': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			}).whereIn(addWhere, scope.split(','));
		if (quarter_id) query.whereIn('b.id', quarter_id);
		// query.groupBy('outlet_id');
		// console.log(query.toSQL().toNative());
		return query;
	}
	getTarget(req: Request): any {
		const {
			outlet_id,
			area_id,
			wilayah_id,
			distributor_id,
			region_id,
			month_id,
			ass_id,
			asm_id,
			salesman_id,
			quarter_id,
		} = req.validated;
		const {scope, level} = req.body.decoded
		let addWhere : string = ''
		if(level === "4") addWhere = 'o.distributor_id'
		if(level === "2") addWhere = 'o.region_id'
		if(level === "3") addWhere = 'o.city_id_alias'
		if(level === "5") addWhere = 'o.outlet_id'
		const query = db()
			.select()
			.sum('st.target_sales as total')
			.from(
				db()
					.select()
					.from('mstr_sales_target')
					.union([db().select('*').from('mstr_sales_target2')])
					.union([db().select('*').from('mstr_sales_target3')])
					.union([db().select('*').from('mstr_sales_target4')])
					.as('st')
			)
			.innerJoin('mstr_outlet as o', 'st.outlet_id', 'o.outlet_id')
			.innerJoin('ms_city_alias as c', 'o.city_id_alias', 'c.city_id_alias')
			.innerJoin('mstr_distributor as d', 'o.distributor_id', 'd.distributor_id')
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			.innerJoin('ms_pulau_alias as r', 'o.region_id', 'r.pulau_id_alias')
			.innerJoin(
				'ms_head_region as hr',
				'r.head_region_id',
				'hr.head_region_id'
			)
			.innerJoin('ms_bulan as b', 'month_target', 'b.bulan')
			// .innerJoin("ms_user_scope", "mstr_outlet.outlet_id", "ms_user_scope.scope")
			// .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
			.where({
				...(month_id && { 'b.id': month_id }),
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.city_id_alias': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			}).whereIn(addWhere, scope.split(','));
		if (quarter_id) query.whereIn('b.id', quarter_id);
		// console.log(query.toSQL().toNative());
		return query;
	}
	getAktualAndPoin(req: Request): any {
		const {
			outlet_id,
			area_id,
			wilayah_id,
			distributor_id,
			region_id,
			month_id,
			ass_id,
			asm_id,
			salesman_id,
			quarter_id,
		} = req.validated;
		const {scope, level} = req.body.decoded
		let addWhere : string = ''
		if(level === "4") addWhere = 'o.distributor_id'
		if(level === "2") addWhere = 'o.region_id'
		if(level === "3") addWhere = 'o.city_id_alias'
		if(level === "5") addWhere = 'o.outlet_id'
		const query = db()
			.select('o.outlet_id', db().raw('MONTH(tr.tgl_transaksi) as bulan'))
			.sum('sales as aktual')
			.sum('point_satuan as poin')
			.from('trx_transaksi as tr')
			.innerJoin(
				'trx_transaksi_barang as trb',
				'tr.kd_transaksi',
				'trb.kd_transaksi'
			)
			.innerJoin('mstr_outlet as o', 'tr.no_id', 'o.outlet_id')
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			.innerJoin('ms_pulau_alias as r', 'o.region_id', 'r.pulau_id_alias')
			.innerJoin(
				'ms_head_region as hr',
				'r.head_region_id',
				'hr.head_region_id'
			)
			.where({
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.city_id_alias': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			}).whereIn(addWhere, scope.split(","));
		if (month_id) query.andWhereRaw('MONTH(tr.tgl_transaksi) = ?', [month_id]);
		if (quarter_id)
			query.andWhereRaw('MONTH(tr.tgl_transaksi) IN(?)', [quarter_id]);

		query.groupBy('bulan');

		return query;
	}
	getAktual(req: Request): any {
		const {
			outlet_id,
			area_id,
			wilayah_id,
			distributor_id,
			region_id,
			month_id,
			ass_id,
			asm_id,
			salesman_id,
			quarter_id,
		} = req.validated;
		const {scope, level} = req.body.decoded
		let addWhere : string = ''
		if(level === "4") addWhere = 'o.distributor_id'
		if(level === "2") addWhere = 'o.region_id'
		if(level === "3") addWhere = 'o.city_id_alias'
		if(level === "5") addWhere = 'o.outlet_id'
		const query = db()
			.select()
			.sum('trb.sales as total')
			.from('trx_transaksi as tr')
			.innerJoin(
				'trx_transaksi_barang as trb',
				'tr.kd_transaksi',
				'trb.kd_transaksi'
			)
			.innerJoin('mstr_outlet as o', 'tr.no_id', 'o.outlet_id')
			.innerJoin('ms_city_alias as c', 'o.city_id_alias', 'c.city_id_alias')
			.innerJoin('mstr_distributor as d', 'o.distributor_id', 'd.distributor_id')
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			.innerJoin('ms_pulau_alias as r', 'o.region_id', 'r.pulau_id_alias')
			.innerJoin(
				'ms_head_region as hr',
				'r.head_region_id',
				'hr.head_region_id'
			)
			// .innerJoin("ms_user_scope", "mstr_outlet.outlet_id", "ms_user_scope.scope")
			// .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
			.where({
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.city_id_alias': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			}).whereIn(addWhere, scope.split(','));
		if (month_id) query.andWhereRaw('MONTH(tr.tgl_transaksi) = ?', [month_id]);
		if (quarter_id)
			query.andWhereRaw('MONTH(tr.tgl_transaksi) IN(?)', [quarter_id]);

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
		const {scope, level} = req.body.decoded
		let addWhere : string = ''
		if(level === "4") addWhere = 'o.distributor_id'
		if(level === "2") addWhere = 'o.region_id'
		if(level === "3") addWhere = 'o.city_id_alias'
		if(level === "5") addWhere = 'o.outlet_id'
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
			.from('mstr_outlet as o')
			.innerJoin('ms_pulau_alias as r', 'o.region_id', 'r.pulau_id_alias')
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
				...(area_id && { 'o.city_id_alias': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			}).whereIn(addWhere, scope.split(","));
		if (month)
			query.andWhereRaw('MONTHNAME(trx_transaksi.tgl_transaksi) = ?', [month]);
		query.groupBy('wilayah').orderBy('aktual', sort);
		return query;
	}
	getSummaryByRegion(req: Request): any {
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
		const {scope, level} = req.body.decoded
		let addWhere : string = ''
		if(level === "4") addWhere = 'o.distributor_id'
		if(level === "2") addWhere = 'o.region_id'
		if(level === "3") addWhere = 'o.city_id_alias'
		if(level === "5") addWhere = 'o.outlet_id'
		const query = db()
			.select(
				'reg.nama_pulau_alias as region',
				this.getAktual(req)
					.where('r.pulau_id_alias', '=', db().raw('reg.pulau_id_alias'))
					.as('aktual'),
				this.getTarget(req)
					.where('r.pulau_id_alias', '=', db().raw('reg.pulau_id_alias'))
					.as('target')
			).count('o.outlet_id as outlet')
			.from('mstr_outlet as o')
			.innerJoin('ms_pulau_alias as reg', 'o.region_id', 'reg.pulau_id_alias')
			.innerJoin(
				'ms_head_region as mhr',
				'reg.head_region_id',
				'mhr.head_region_id'
			)
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			// .innerJoin("ms_user_scope", "o.outlet_id", "ms_user_scope.scope")
			// .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
			.where({
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.city_id_alias': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'reg.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			}).whereIn(addWhere, scope.split(","));
		if (month)
			query.andWhereRaw('MONTHNAME(trx_transaksi.tgl_transaksi) = ?', [month]);
		query.groupBy('region').orderBy('aktual', sort);
		return query;
	}
	getSummaryByDistributor(req: Request): any {
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
		const {scope, level} = req.body.decoded
		let addWhere : string = ''
		if(level === "4") addWhere = 'o.distributor_id'
		if(level === "2") addWhere = 'o.region_id'
		if(level === "3") addWhere = 'o.city_id_alias'
		if(level === "5") addWhere = 'o.outlet_id'

		const query = db()
			.select(
				'dist.distributor_name as distributor',
				this.getAktual(req)
					.where('d.distributor_id', '=', db().raw('dist.distributor_id'))
					.as('aktual'),
				this.getTarget(req)
					.where('d.distributor_id', '=', db().raw('dist.distributor_id'))
					.as('target')
			).count('o.outlet_id as outlet')
			.from('mstr_outlet as o')
			.innerJoin('mstr_distributor as dist', 'o.distributor_id', 'dist.distributor_id')
			.innerJoin('ms_pulau_alias as reg', 'o.region_id', 'reg.pulau_id_alias')
			.innerJoin(
				'ms_head_region as mhr',
				'reg.head_region_id',
				'mhr.head_region_id'
			)
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			// .innerJoin("ms_user_scope", "o.outlet_id", "ms_user_scope.scope")
			// .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
			.where({
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.city_id_alias': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'reg.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			}).whereIn(addWhere, scope.split(','));
		if (month)
			query.andWhereRaw('MONTHNAME(trx_transaksi.tgl_transaksi) = ?', [month]);
		query.groupBy('distributor').orderBy('aktual', sort).limit(5);
		return query;
	}
	getSummaryByArea(req: Request): any {
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
		const {scope, level} = req.body.decoded
		let addWhere : string = ''
		if(level === "distributor_manager") addWhere = 'out.distributor_id'
		if(level === "region_manager") addWhere = 'out.region_id'
		if(level === "area_manager") addWhere = 'out.city_id_alias'
		if(level === "outlet_manager") addWhere = 'out.outlet_id'
		const query = db()
			.select(
				'ci.city_name_alias as city',
				this.getAktual(req)
					.where('c.city_id_alias', '=', db().raw('ci.city_id_alias'))
					.as('aktual'),
				this.getTarget(req)
					.where('c.city_id_alias', '=', db().raw('ci.city_id_alias'))
					.as('target')
			).count('out.outlet_id as outlet')
			.from('mstr_outlet as out')
			.innerJoin('mstr_distributor as dist', 'out.distributor_id', 'dist.distributor_id')
			.innerJoin('ms_city_alias as ci', 'out.city_id_alias', 'ci.city_id_alias')
			.innerJoin('ms_pulau_alias as reg', 'out.region_id', 'reg.pulau_id_alias')
			.innerJoin(
				'ms_head_region as mhr',
				'reg.head_region_id',
				'mhr.head_region_id'
			)
			.innerJoin('ms_dist_pic as pic', 'out.distributor_id', 'pic.distributor_id')
			// .innerJoin("ms_user_scope", "out.outlet_id", "ms_user_scope.scope")
			// .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
			.where({
				...(outlet_id && { 'out.outlet_id': outlet_id }),
				...(area_id && { 'out.city_id_alias': area_id }),
				...(region_id && { 'out.region_id': region_id }),
				...(distributor_id && { 'out.distributor_id': distributor_id }),
				...(wilayah_id && { 'reg.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			}).whereIn(addWhere, scope.split(","));
		if (month)
			query.andWhereRaw('MONTHNAME(trx_transaksi.tgl_transaksi) = ?', [month]);
		query.groupBy('city').orderBy('aktual', sort).limit(5);
		return query;
	}
	getSummaryByOutlet(req: Request): any {
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
		const {scope, level} = req.body.decoded
		let addWhere : string = ''
		if(level === "distributor_manager") addWhere = 'out.distributor_id'
		if(level === "region_manager") addWhere = 'out.region_id'
		if(level === "area_manager") addWhere = 'out.city_id_alias'
		if(level === "outlet_manager") addWhere = 'out.outlet_id'
		const query = db()
			.select(
				'out.outlet_name as outlet_name',
				this.getAktual(req)
					.where('o.outlet_id', '=', db().raw('out.outlet_id'))
					.as('aktual'),
				this.getTarget(req)
					.where('o.outlet_id', '=', db().raw('out.outlet_id'))
					.as('target')
			).count('out.outlet_id as outlet')
			.from('mstr_outlet as out')
			.innerJoin('mstr_distributor as dist', 'out.distributor_id', 'dist.distributor_id')
			.innerJoin('ms_city_alias as ci', 'out.city_id_alias', 'ci.city_id_alias')
			.innerJoin('ms_pulau_alias as reg', 'out.region_id', 'reg.pulau_id_alias')
			.innerJoin(
				'ms_head_region as mhr',
				'reg.head_region_id',
				'mhr.head_region_id'
			)
			.innerJoin('ms_dist_pic as pic', 'out.distributor_id', 'pic.distributor_id')
			// .innerJoin("ms_user_scope", "out.outlet_id", "ms_user_scope.scope")
			// .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
			.where({
				...(outlet_id && { 'out.outlet_id': outlet_id }),
				...(area_id && { 'out.city_id_alias': area_id }),
				...(region_id && { 'out.region_id': region_id }),
				...(distributor_id && { 'out.distributor_id': distributor_id }),
				...(wilayah_id && { 'reg.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			}).whereIn(addWhere, scope.split(","));
		if (month)
			query.andWhereRaw('MONTHNAME(trx_transaksi.tgl_transaksi) = ?', [month]);
		query.groupBy('outlet_name').orderBy('aktual', sort).limit(5);
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
		const {scope, level} = req.body.decoded
		let addWhere : string = ''
		if(level === "4") addWhere = 'o.distributor_id'
		if(level === "2") addWhere = 'o.region_id'
		if(level === "3") addWhere = 'o.city_id_alias'
		if(level === "5") addWhere = 'o.outlet_id'
		const query = db()
			.select(
				'mp.nama_pic as nama_pic',
				this.getAktual(req)
					.where('pic.asm_id', '=', db().raw('mp.kode_pic'))
					.as('aktual'),
				this.getTarget(req)
					.where('pic.asm_id', '=', db().raw('mp.kode_pic'))
					.as('target')
			).count('o.outlet_id as outlet')
			.from('mstr_outlet as o')
			.innerJoin('ms_pulau_alias as r', 'o.region_id', 'r.pulau_id_alias')
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
				...(area_id && { 'o.city_id_alias': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			}).whereIn(addWhere, scope.split(","));
		if (month)
			query.andWhereRaw('MONTHNAME(trx_transaksi.tgl_transaksi) = ?', [month]);
		query.groupBy('nama_pic').orderBy('aktual', sort).limit(5);
		return query;
	}
	getSummaryByASS(req: Request): any {
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
		const {scope, level} = req.body.decoded
		let addWhere : string = ''
		if(level === "4") addWhere = 'o.distributor_id'
		if(level === "2") addWhere = 'o.region_id'
		if(level === "3") addWhere = 'o.city_id_alias'
		if(level === "5") addWhere = 'o.outlet_id'
		const query = db()
			.select(
				'mp.nama_pic as nama_pic',
				this.getAktual(req)
					.where('pic.ass_id', '=', db().raw('mp.kode_pic'))
					.as('aktual'),
				this.getTarget(req)
					.where('pic.ass_id', '=', db().raw('mp.kode_pic'))
					.as('target')
			).count('o.outlet_id as outlet')
			.from('mstr_outlet as o')
			.innerJoin('ms_pulau_alias as r', 'o.region_id', 'r.pulau_id_alias')
			.innerJoin(
				'ms_head_region as mhr',
				'r.head_region_id',
				'mhr.head_region_id'
			)
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			.innerJoin('ms_pic as mp', 'pic.ass_id', 'mp.kode_pic')
			// .innerJoin("ms_user_scope", "o.outlet_id", "ms_user_scope.scope")
			// .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
			.where({
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.city_id_alias': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			}).whereIn(addWhere, scope.split(","));
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
			month_id,
			ass_id,
			asm_id,
			salesman_id,
			sort,
			quarter_id,
		} = req.validated;
		const {scope, level} = req.body.decoded
		let addWhere : string = ''
		if(level === "4") addWhere = 'o.distributor_id'
		if(level === "2") addWhere = 'o.region_id'
		if(level === "3") addWhere = 'o.city_id_alias'
		if(level === "5") addWhere = 'o.outlet_id'
		const query = db()
			.select(
				'mst.target_annual',
				'o.outlet_id',
				db().raw(
					"SUM(trb.sales) as sales, CASE when round((sum(trb.sales)/mst.target_annual) * 100, 5) < 25 or trb.sales is null then '0% - 25%' WHEN ROUND((SUM(trb.sales)/mst.target_annual) * 100, 5) >= 25 and ROUND((SUM(trb.sales)/mst.target_annual) * 100, 5) < 50 then '25% - 50%' WHEN ROUND((SUM(trb.sales)/mst.target_annual) * 100, 5) >= 50 and ROUND((SUM(trb.sales)/mst.target_annual) * 100, 5) < 75 THEN '50% - 75%' WHEN ROUND((SUM(trb.sales)/mst.target_annual) * 100, 5) >= 75 AND ROUND((SUM(trb.sales)/mst.target_annual) * 100, 5) < 95 THEN '75% - 95%' WHEN ROUND((SUM(trb.sales)/mst.target_annual) * 100, 5) >= 95 AND ROUND((SUM(trb.sales)/mst.target_annual) * 100, 5) < 100 THEN '95% - 100%' else '>= 100%' end as cluster"
				)
			)
			.from('mstr_outlet as o')
			.leftJoin('trx_transaksi as tr', 'tr.no_id', 'o.outlet_id')
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			.innerJoin('ms_pulau_alias as r', 'o.region_id', 'r.pulau_id_alias')
			.innerJoin(
				'ms_head_region as hr',
				'r.head_region_id',
				'hr.head_region_id'
			)
			.leftJoin(
				'trx_transaksi_barang as trb',
				'trb.kd_transaksi',
				'tr.kd_transaksi'
			)
			.innerJoin(
				this.getTargetByAchieve(req).groupBy('outlet_id').as('mst'),
				'mst.outlet_id',
				'o.outlet_id'
			)
			.where({
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.city_id_alias': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
			}).whereIn(addWhere, scope.split(","));
		month_id && query.whereRaw('MONTH(tr.tgl_transaksi) = ?', [month_id]);
		quarter_id && query.whereRaw('MONTH(tr.tgl_transaksi) IN(?)', [quarter_id]);
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
		const {scope, level} = req.body.decoded
		let addWhere : string = ''
		if(level === "4") addWhere = 'o.distributor_id'
		if(level === "2") addWhere = 'o.region_id'
		if(level === "3") addWhere = 'o.city_id_alias'
		if(level === "5") addWhere = 'o.outlet_id'
		const query = db()
			.distinct(
				this.getAktual(req).as('aktual'),
				this.getTarget(req).as('target'),
				OutletService.getOutletCount(req).as('total_outlet')
			)
			.from('mstr_outlet as o')
			.innerJoin('ms_pulau_alias as r', 'o.region_id', 'r.pulau_id_alias')
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
				...(area_id && { 'o.city_id_alias': area_id }),
				...(region_id && { 'o.region_id': region_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				// ...(salesman_id && { "ms_user.user_id": salesman_id }),
			}).whereIn(addWhere, scope.split(","));
		return query;
	}
	getSummaryPerQuarter(req: Request) {
		const query = db()
			.select('b.bulan', 'aktual', 'poin')
			.sum('target_annual as target')
			.from('mstr_outlet as o')
			.leftJoin(
				this.getTargetByAchieve(req).groupBy('b.id').as('mst'),
				'o.outlet_id',
				'mst.outlet_id'
			)
			.leftJoin(this.getAktualAndPoin(req).as('trb'), 'trb.bulan', 'mst.bulan')
			.innerJoin('ms_bulan as b', 'mst.bulan', 'b.id')
			.groupBy('b.id')
			.orderBy('b.id', 'asc');

		return query;
	}
	getSummaryPerSemester(req: Request) {
		const { semester_id } = req.validated;
		const query = db()
			.select(
				db().raw(`CASE WHEN b.id = 1 OR b.id = 2 OR b.id = 3 THEN '1'
			WHEN b.id = 4 OR b.id = 5 OR b.id = 6 THEN '2'
			WHEN b.id = 7 OR b.id = 8 OR b.id = 9 THEN '3'
			WHEN b.id = 10 OR b.id = 11 OR b.id = 12 THEN '4'
			END AS kuartal`)
			)
			.sum('target_annual as target')
			.sum('aktual as aktual')
			.sum('poin as poin')
			.from('mstr_outlet as o')
			.leftJoin(
				this.getTargetByAchieve(req).groupBy('b.id').as('mst'),
				'o.outlet_id',
				'mst.outlet_id'
			)
			.leftJoin(this.getAktualAndPoin(req).as('trb'), 'trb.bulan', 'mst.bulan')
			.innerJoin('ms_bulan as b', 'mst.bulan', 'b.id')
			.whereIn('b.id', semester_id)
			.groupBy('kuartal');

		return query;
	}
	getSummaryPerYear(req: Request) {
		const query = db()
			.select(
				db()
					.raw(`CASE WHEN b.id = 1 OR b.id = 2 OR b.id = 3 OR b.id = 4 OR b.id = 5 OR b.id = 6 THEN '1'
				WHEN b.id = 4 OR b.id = 5 OR b.id = 6 OR b.id = 7 OR b.id = 8 OR b.id = 9 or b.id = 10 OR b.id = 11 OR b.id = 12 THEN '2'
			END AS kuartal`)
			)
			.sum('target_annual as target')
			.sum('aktual as aktual')
			.sum('poin as poin')
			.from('mstr_outlet as o')
			.leftJoin(
				this.getTargetByAchieve(req).groupBy('b.id').as('mst'),
				'o.outlet_id',
				'mst.outlet_id'
			)
			.leftJoin(this.getAktualAndPoin(req).as('trb'), 'trb.bulan', 'mst.bulan')
			.innerJoin('ms_bulan as b', 'mst.bulan', 'b.id')
			.groupBy('kuartal');

		return query;
	}
	getSummaryByYear(req: Request) {
		const query = db()
			.select()
			.sum('target_annual as target')
			.sum('aktual as aktual')
			.sum('poin as poin')
			.from('mstr_outlet as o')
			.leftJoin(
				this.getTargetByAchieve(req).groupBy('b.id').as('mst'),
				'o.outlet_id',
				'mst.outlet_id'
			)
			.leftJoin(this.getAktualAndPoin(req).as('trb'), 'trb.bulan', 'mst.bulan')
			.innerJoin('ms_bulan as b', 'mst.bulan', 'b.id');

		return query;
	}
}

export default new Sales();
