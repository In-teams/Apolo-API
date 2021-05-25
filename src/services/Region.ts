import { Request } from "express";
import db from "../config/db";

class Region {
  get(req: Request): any {
    const {
      outlet_id,
      area_id,
      wilayah_id,
      distributor_id,
      ass_id,
      asm_id,
      salesman_id,
    } = req.validated;
    const query = db()
      .select("ms_region.region_name")
      .distinct("ms_region.region_id")
      .from("ms_region")
      .innerJoin("ms_outlet", "ms_region.region_id", "ms_outlet.region_id")
      .innerJoin("ms_user_scope", "ms_outlet.outlet_id", "ms_user_scope.scope")
      .innerJoin(
        "ms_dist_pic",
        "ms_outlet.distributor_id",
        "ms_dist_pic.distributor_id"
      )
      .where({
        ...(outlet_id && { "ms_outlet.outlet_id": outlet_id }),
        ...(area_id && { "ms_outlet.area_id": area_id }),
        ...(distributor_id && { "ms_outlet.distributor_id": distributor_id }),
        ...(wilayah_id && { "ms_region.head_region_id": wilayah_id }),
        ...(ass_id && { "ms_dist_pic.ass_id": ass_id }),
        ...(asm_id && { "ms_dist_pic.asm_id": asm_id }),
        ...(salesman_id && { "ms_user_scope.user_id": salesman_id }),
      })
      .orderBy("ms_region.region_id");
    // console.log(query.toSQL().toNative());
    return query;
  }
}

export default new Region();
