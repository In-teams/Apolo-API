import { Request } from "express";
import db from "../config/db";

class Distributor {
  get(req: Request): any {
    const {
      outlet_id,
      area_id,
      region_id,
      wilayah_id,
      ass_id,
      asm_id,
      salesman_id,
    } = req.validated;
    const {scope, level} = req.body.decoded
		let addWhere : string = ''
		if(level === "distributor_manager") addWhere = 'o.distributor_id'
		if(level === "region_manager") addWhere = 'o.region_id'
		if(level === "area_manager") addWhere = 'o.city_id_alias'
		if(level === "outlet_manager") addWhere = 'o.outlet_id'
    const query = db()
      .select("d.distributor_name")
      .distinct("d.distributor_id")
      .from("mstr_distributor as d")
      .innerJoin(
        "mstr_outlet as o",
        "d.distributor_id",
        "o.distributor_id"
      )
      .innerJoin("ms_pulau_alias as r", "o.region_id", "r.pulau_id_alias")
      .innerJoin("ms_user_scope as us", "o.outlet_id", "us.scope")
      .innerJoin(
        "ms_dist_pic as pic",
        "o.distributor_id",
        "pic.distributor_id"
      )
      .where({
        ...(outlet_id && { "o.outlet_id": outlet_id }),
        ...(area_id && { "o.city_id_alias": area_id }),
        ...(region_id && { "o.region_id": region_id }),
        ...(wilayah_id && { "r.head_region_id": wilayah_id }),
        ...(ass_id && { "pic.ass_id": ass_id }),
        ...(asm_id && { "pic.asm_id": asm_id }),
        ...(salesman_id && { "us.user_id": salesman_id }),
      }).whereIn(addWhere, scope.split(','))
      .orderBy("distributor_id");
    return query;
  }
}

export default new Distributor();
