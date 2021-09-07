import { Request } from "express";
import db from "../config/db";

class Wilayah {
  get(req: Request): any {
    const {
      outlet_id,
      area_id,
      region_id,
      distributor_id,
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
      .select("hr.head_region_name")
      .distinct("hr.head_region_id")
      .from("ms_head_region as hr")
      .innerJoin(
        "ms_pulau_alias as r",
        "hr.head_region_id",
        "r.head_region_id"
      )
      .innerJoin("mstr_outlet as o", "r.pulau_id_alias", "o.region_id")
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
        ...(distributor_id && { "o.distributor_id": distributor_id }),
        ...(ass_id && { "pic.ass_id": ass_id }),
        ...(asm_id && { "pic.asm_id": asm_id }),
        ...(salesman_id && { "us.user_id": salesman_id }),
      }).whereIn(addWhere, scope.split(','))
      .orderBy("head_region_id");
    return query;
  }
}

export default new Wilayah();
