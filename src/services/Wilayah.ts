import { Request } from 'express';
import { QueryTypes } from 'sequelize';
import db from '../config/db';

class Wilayah {
	async get(req: Request): Promise<any> {
		let {
			outlet_id,
			area_id,
			wilayah_id,
			distributor_id,
			region_id,
			ass_id,
			asm_id,
			salesman_id,
		} = req.validated;
		const { scope, level } = req.decoded;
		let addWhere: string | null = null;
		let params: string[] = [];
		if (level === '4') addWhere = 'o.distributor_id';
		if (level === '2') addWhere = 'o.region_id';
		if (level === '3') addWhere = 'o.city_id_alias';
		if (level === '5') addWhere = 'o.outlet_id';

		let query =
			'select distinct mhr.head_region_id, mhr.head_region_name from ms_head_region as mhr INNER JOIN ms_pulau_alias as r on mhr.head_region_id = r.head_region_id INNER JOIN mstr_outlet as o on r.pulau_id_alias = o.region_id INNER JOIN ms_user_scope as us on o.outlet_id = us.scope INNER JOIN ms_dist_pic as dp on o.distributor_id = dp.distributor_id WHERE mhr.head_region_id IS NOT NULL';

		if (addWhere) {
			query += ' AND ' + addWhere + ' IN (?)';
			params.push(scope);
		}
		if (distributor_id) {
			query += ' AND o.distributor_id = ?';
			params.push(distributor_id);
		}
		if (region_id) {
			query += ' AND o.region_id = ?';
			params.push(region_id);
		}
		if (outlet_id) {
			query += ' AND o.outlet_id = ?';
			params.push(outlet_id);
		}
		if (area_id) {
			query += ' AND o.city_id_alias = ?';
			params.push(area_id);
		}
		if (wilayah_id) {
			query += ' AND r.head_region_id = ?';
			params.push(wilayah_id);
		}
		if (ass_id) {
			query += ' AND dp.ass_id = ?';
			params.push(ass_id);
		}
		if (asm_id) {
			query += ' AND dp.asm_id = ?';
			params.push(asm_id);
		}

		return await db.query(query + ' order by mhr.head_region_id ASC', {
			raw: true,
			type: QueryTypes.SELECT,
			replacements: params,
		});
	}
}

export default new Wilayah();
