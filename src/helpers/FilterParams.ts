import { Request } from "express";

class filterParams{
    index(req: Request, query: string){
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
        const { scope, level } = req.body.decoded;
		let addWhere: string | null = null;
		let params: string[] = [];
		if (level === '4') addWhere = 'o.distributor_id';
		if (level === '2') addWhere = 'o.region_id';
		if (level === '3') addWhere = 'o.city_id_alias';
		if (level === '5') addWhere = 'o.outlet_id';

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

        return {query, params}
    }
}

export default new filterParams().index