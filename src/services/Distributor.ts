import {Request} from "express";
import {QueryTypes} from "sequelize";
import db from "../config/db";
import FilterParams from "../helpers/FilterParams";

class Distributor {
  async get(req: Request): Promise<any> {
    const query =
      "select distinct d.distributor_name, d.distributor_id from mstr_distributor as d INNER JOIN mstr_outlet as o on d.distributor_id = o.distributor_id INNER JOIN ms_pulau_alias as reg on o.region_id = reg.pulau_id_alias INNER JOIN ms_user_scope as us on o.outlet_id = us.scope INNER JOIN ms_dist_pic as dp on o.distributor_id = dp.distributor_id WHERE d.distributor_id IS NOT NULL";

    let { query: newQuery, params } = FilterParams.query(req, query);
    if (req.validated.keyword) {
      newQuery += " AND d.distributor_name LIKE ?";
      params.push(`%${req.validated.keyword}%`);
    }

    return await db.query(newQuery + " order by d.distributor_id ASC", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: params,
    });
  }
}

export default new Distributor();
