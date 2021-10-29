import { Request } from "express";
import { QueryTypes } from "sequelize";
import db from "../config/db";
import FilterParams from "../helpers/FilterParams";

let queryOutletCount =
  "SELECT COUNT(DISTINCT o.outlet_id) AS total FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.`region_id` = reg.`pulau_id_alias` INNER JOIN ms_dist_pic AS dp ON o.`distributor_id` = dp.`distributor_id` WHERE o.`outlet_id` IS NOT NULL";

class Outlet {
  async getOutlet(req: Request): Promise<any> {
    const { outlet_id } = req.validated;

    return await db.query("SELECT * FROM mstr_outlet WHERE outlet_id = ?", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [outlet_id],
    });
  }
  async getOutletCount(req: Request): Promise<any> {

    const {query, params} = FilterParams.query(req, queryOutletCount)
    const data: any = await db.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...params],
    });

    return data
    return data[0]?.total
  }
  async get(req: Request): Promise<any> {
    let q =
    "select distinct o.outlet_id, o.outlet_name from mstr_outlet as o INNER JOIN ms_pulau_alias as reg on o.region_id = reg.pulau_id_alias INNER JOIN ms_dist_pic as dp on o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL";

    let { query, params } = FilterParams.query(req, q);

    return await db.query(query + " order by o.outlet_id ASC", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: params,
    });
  }
  async getOutletActive(req: Request): Promise<any> {
    let { query: qoc, params: poc } = FilterParams.query(req, queryOutletCount);

    let q = `SELECT (${qoc}) AS total_outlet, COUNT(DISTINCT tr.no_id) AS aktif FROM trx_transaksi AS tr INNER JOIN mstr_outlet AS o ON tr.no_id = o.outlet_id INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`;

    let { query, params } = FilterParams.query(req, q);

    return await db.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...poc, ...params],
    });
  }
  async resetRegistration(): Promise<any> {
    return await db.query("UPDATE mstr_outlet SET valid = ?, register_at = ? WHERE outlet_id = ?", {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: ["No", null, "100000-ANA047"],
    });
  }
  async outletIsRegist(outlet_id: string): Promise<any> {
    const get: any = await db.query("SELECT valid FROM mstr_outlet WHERE outlet_id = ?", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [outlet_id],
    });

    return get[0]?.valid
  }
}

export default new Outlet();
