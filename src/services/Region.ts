import { Request } from 'express';
import db from '../config/db';

class Region {
	get(req: Request): any {
		const {
			outlet_id,
			area_id,
			wilayah_id,
			distributor_id,
			ass_id,
			asm_id,
			salesman_id,
		} = req.validated;
		const { scope, level } = req.body.decoded;
		let addWhere: string = '';
		if (level === '4') addWhere = 'o.distributor_id';
		if (level === '2') addWhere = 'o.region_id';
		if (level === '3') addWhere = 'o.city_id_alias';
		if (level === '5') addWhere = 'o.outlet_id';
		const query = db()
			.select('r.nama_pulau_alias as region_name')
			.distinct('r.pulau_id_alias as region_id')
			.from('ms_pulau_alias as r')
			.innerJoin('mstr_outlet as o', 'r.pulau_id_alias', 'o.region_id')
			.innerJoin('ms_user_scope as us', 'o.outlet_id', 'us.scope')
			.innerJoin('ms_dist_pic as pic', 'o.distributor_id', 'pic.distributor_id')
			.where({
				...(outlet_id && { 'o.outlet_id': outlet_id }),
				...(area_id && { 'o.city_id_alias': area_id }),
				...(distributor_id && { 'o.distributor_id': distributor_id }),
				...(wilayah_id && { 'r.head_region_id': wilayah_id }),
				...(ass_id && { 'pic.ass_id': ass_id }),
				...(asm_id && { 'pic.asm_id': asm_id }),
				...(salesman_id && { 'us.user_id': salesman_id }),
			})
			.whereIn(addWhere, scope.split(','))
			.orderBy('region_id');
		// console.log(query.toSQL().toNative());
		return query;
	}
}

export default new Region();
