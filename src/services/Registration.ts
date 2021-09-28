import { Request } from "express";
import { QueryTypes } from "sequelize";
import db from "../config/db";
import DateFormat from "../helpers/DateFormat";
import FilterParams from "../helpers/FilterParams";
import OutletService from "./Outlet";

let queryOutletCount =
  "SELECT COUNT(DISTINCT o.outlet_id) AS total FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS r ON o.`region_id` = r. `pulau_id_alias` INNER JOIN ms_dist_pic AS dp ON o.`distributor_id` = dp.`distributor_id` WHERE o.`outlet_id` IS NOT NULL";

class Registration {
  async getRegistrationSummary(req: Request): Promise<any> {
    let { query: qoc, params: poc } = FilterParams.query(req, queryOutletCount);
    let q = `SELECT (${qoc}) AS total_outlet, COUNT(DISTINCT o.outlet_id) AS total FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS r ON o.region_id = r. pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL AND o.valid NOT IN ('No', 'No+')`;

	let {query, params} = FilterParams.query(req, q)
	return await db.query(query, {
		raw: true,
		type: QueryTypes.SELECT,
		replacements: [...poc, ...params],
	  });
  }
}

export default new Registration();
