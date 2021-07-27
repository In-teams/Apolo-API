import { Request } from "express";
import db from "../config/db";

class Area {
  get(req: Request): any {
    const {
      outlet_id,
      region_id,
      wilayah_id,
      distributor_id,
      ass_id,
      asm_id,
      salesman_id,
    } = req.validated;
    const query = db()
      .select("c.city_name_alias as area_name")
      .distinct("c.city_id_alias as area_id")
      .from("ms_city_alias as c")
      .innerJoin("mstr_outlet as o", "c.city_id_alias", "o.city_id_alias")
      .innerJoin("ms_pulau_alias as r", "o.region_id", "r.pulau_id_alias")
      .innerJoin("ms_user_scope as us", "o.outlet_id", "us.scope")
      .innerJoin(
        "ms_dist_pic as pic",
        "o.distributor_id",
        "pic.distributor_id"
      )
      .where({
        ...(outlet_id && { "o.outlet_id": outlet_id }),
        ...(region_id && { "o.region_id": region_id }),
        ...(distributor_id && { "o.distributor_id": distributor_id }),
        ...(wilayah_id && { "r.head_region_id": wilayah_id }),
        ...(ass_id && { "pic.ass_id": ass_id }),
        ...(asm_id && { "pic.asm_id": asm_id }),
        ...(salesman_id && { "us.user_id": salesman_id }),
      })
      .orderBy("area_id");
    // console.log(query.toSQL().toNative());
    return query;
  }
}

export default new Area();
