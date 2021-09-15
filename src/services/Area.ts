import { Request } from "express";
import { QueryTypes } from "sequelize";
import db from "../config/db";

class Area {
  async get(req: Request): Promise<any> {
    let {
        outlet_id,
        area_id,
        wilayah_id,
        distributor_id,
        region_id,
        ass_id,
        salesman_id,
    } = req.validated;
    const { scope, level } = req.body.decoded;
    let addWhere: string | null = null;
    let params: string[] = [];
    if (level === '4') addWhere = 'o.distributor_id';
    if (level === '2') addWhere = 'o.region_id';
    if (level === '3') addWhere = 'o.city_id_alias';
    if (level === '5') addWhere = 'o.outlet_id';

    let query =
        'select distinct pic.nama_pic, dp.asm_id from ms_dist_pic as dp inner join mstr_outlet as o on dp.distributor_id = o.distributor_id inner join ms_user_scope as us on o.outlet_id = us.scope inner join ms_pic as pic on dp.asm_id = pic.kode_pic inner join ms_pulau_alias as r on o.region_id = r.pulau_id_alias WHERE dp.distributor_id IS NOT NULL';

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

    return await db.query(query + ' order by dp.asm_id asc', {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: params,
    });
  }
}

export default new Area();
