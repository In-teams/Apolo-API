import { Request } from "express";
import { QueryTypes } from "sequelize";
import db from "../config/db";
import FilterParams from "../helpers/FilterParams";

class Region {
  async getAsm(req: Request): Promise<any[]> {
    let query =
      "select distinct pic.nama_pic, dp.asm_id from ms_dist_pic as dp inner join mstr_outlet as o on dp.distributor_id = o.distributor_id inner join ms_user_scope as us on o.outlet_id = us.scope inner join ms_pic as pic on dp.asm_id = pic.kode_pic inner join ms_pulau_alias as reg on o.region_id = reg.pulau_id_alias WHERE dp.distributor_id IS NOT NULL";

    let { query: newQuery, params } = FilterParams.query(req, query);

    return await db.query(newQuery + " order by dp.asm_id asc", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: params,
    });
  }
  async getAss(req: Request): Promise<any> {
    let query =
      "select distinct pic.nama_pic, dp.ass_id from ms_dist_pic as dp inner join mstr_outlet as o on dp.distributor_id = o.distributor_id inner join ms_user_scope as us on o.outlet_id = us.scope inner join ms_pic as pic on dp.ass_id = pic.kode_pic inner join ms_pulau_alias as reg on o.region_id = reg.pulau_id_alias WHERE dp.distributor_id IS NOT NULL";

    let { query: newQuery, params } = FilterParams.query(req, query);

    return await db.query(newQuery + " order by dp.ass_id asc", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: params,
    });
  }
  getSalesman(req: Request): any {}
}

export default new Region();
