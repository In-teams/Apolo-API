import {Request} from "express";
import {QueryTypes} from "sequelize";
import db from "../config/db";
import FilterParams from "../helpers/FilterParams";

class Wilayah {
  async get(req: Request): Promise<any> {
    const query =
      "select distinct mhr.head_region_id, mhr.head_region_name from ms_head_region as mhr INNER JOIN ms_pulau_alias as reg on mhr.head_region_id = reg.head_region_id INNER JOIN mstr_outlet as o on reg.pulau_id_alias = o.region_id INNER JOIN ms_user_scope as us on o.outlet_id = us.scope INNER JOIN ms_dist_pic as dp on o.distributor_id = dp.distributor_id WHERE mhr.head_region_id IS NOT NULL";

    let { query: newQuery, params } = FilterParams.query(req, query);

    if (req.validated.keyword) {
      newQuery += " AND mhr.head_region_name LIKE ?";
      params.push(`%${req.validated.keyword}%`);
    }

    return await db.query(newQuery + " order by mhr.head_region_id ASC", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: params,
    });
  }
}

export default new Wilayah();
