import {Request} from "express";
import {QueryTypes} from "sequelize";
import db from "../config/db";
import FilterParams from "../helpers/FilterParams";

class Area {
  async get(req: Request): Promise<any> {
    const query =
      "select distinct c.city_name_alias as area_name, c.city_id_alias as area_id from ms_city_alias as c inner join mstr_outlet as o on c.city_id_alias = o.city_id_alias inner join ms_pulau_alias as reg on o.region_id = reg.pulau_id_alias inner join ms_user_scope as us on o.outlet_id = us.scope inner join ms_dist_pic as dp on o.distributor_id = dp.distributor_id WHERE c.city_id_alias IS NOT NULL";

    let { query: newQuery, params } = FilterParams.query(req, query);
    if (req.validated.keyword) {
      newQuery += " AND c.city_name_alias LIKE ?";
      params.push(`%${req.validated.keyword}%`);
    }

    return await db.query(newQuery + " order by area_id asc", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: params,
    });
  }
}

export default new Area();
