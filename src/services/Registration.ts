import { Request } from "express";
import { QueryTypes } from "sequelize";
import db from "../config/db";
import FilterParams from "../helpers/FilterParams";

let queryOutletCount =
  "SELECT COUNT(DISTINCT o.outlet_id) AS total FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS r ON o.`region_id` = r. `pulau_id_alias` INNER JOIN ms_dist_pic AS dp ON o.`distributor_id` = dp.`distributor_id` WHERE o.`outlet_id` IS NOT NULL";

class Registration {
  async getRegistrationSummary(req: Request): Promise<any> {
    let { query: qoc, params: poc } = FilterParams.query(req, queryOutletCount);
    let q = `SELECT (${qoc}) AS total_outlet, COUNT(DISTINCT o.outlet_id) AS total FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS r ON o.region_id = r. pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL AND o.valid NOT IN ('No', 'No+')`;

    let { query, params } = FilterParams.query(req, q);
    return await db.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...poc, ...params],
    });
  }
  async getRegistrationSummaryByHR(req: Request): Promise<any> {
    const { sort } = req.validated;
    let { query: qoc, params: poc } = FilterParams.query(
      req,
      queryOutletCount +
        " AND o.valid IN ('No', 'No+') AND r.head_region_id = mhr.head_region_id"
    );
    let q = `SELECT mhr.head_region_name as wilayah, (${qoc}) AS notregist, COUNT(o.outlet_id) AS regist, TRUNCATE((COUNT(o.outlet_id)/((${qoc}) + COUNT(o.outlet_id)) * 100), 2) AS pencapaian FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg. pulau_id_alias INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL AND o.valid NOT IN ('No', 'No+')`;

    let { query, params } = FilterParams.query(req, q);
    return await db.query(query + ` GROUP BY wilayah ORDER BY pencapaian ${sort}`, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...poc, ...poc, ...params],
    });
  }
  async getLastRegistration(req: Request): Promise<any> {
    let q =
      "select distinct o.* from mstr_outlet as o INNER JOIN ms_pulau_alias as r on o.region_id = r.pulau_id_alias INNER JOIN ms_user_scope as us on o.outlet_id = us.scope INNER JOIN ms_dist_pic as dp on o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL AND o.register_at IS NOT NULL AND o.valid NOT IN('No', 'No+')";

    let { query, params } = FilterParams.query(req, q);

    return await db.query(query + " order by o.register_at DESC", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: params,
    });
  }
}

export default new Registration();
