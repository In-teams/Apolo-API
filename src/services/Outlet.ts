import { Request } from "express";
import { QueryTypes } from "sequelize";
import db from "../config/db";
import FilterParams from "../helpers/FilterParams";

let queryOutletCount =
  "SELECT COUNT(DISTINCT o.outlet_id) AS total FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS r ON o.`region_id` = r. `pulau_id_alias` INNER JOIN ms_dist_pic AS dp ON o.`distributor_id` = dp.`distributor_id` WHERE o.`outlet_id` IS NOT NULL";

class Outlet {
  async getOutlet(req: Request): Promise<any> {
    const { outlet_id } = req.validated;

    return await db.query("SELECT * FROM mstr_outlet WHERE outlet_id = ?", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [outlet_id],
    });
  }
  async get(req: Request): Promise<any> {
    let q =
      "select distinct o.* from mstr_outlet as o INNER JOIN ms_pulau_alias as r on o.region_id = r.pulau_id_alias INNER JOIN ms_user_scope as us on o.outlet_id = us.scope INNER JOIN ms_dist_pic as dp on o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL";

    let { query, params } = FilterParams.query(req, q);

    return await db.query(query + " order by o.outlet_id ASC", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: params,
    });
  }
  async getOutletActive(req: Request): Promise<any> {
    let { query: qoc, params: poc } = FilterParams.query(req, queryOutletCount);

    let q = `SELECT (${qoc}) AS total_outlet, COUNT(DISTINCT tr.no_id) AS aktif FROM trx_transaksi AS tr INNER JOIN mstr_outlet AS o ON tr.no_id = o.outlet_id INNER JOIN ms_pulau_alias AS r ON o.region_id = r. pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`;

    let { query, params } = FilterParams.query(req, q);

    return await db.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...poc, ...params],
    });
  }
}

export default new Outlet();
