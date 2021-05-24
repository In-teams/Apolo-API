import { Request } from "express";
import db from "../config/db";

class Region {
  getAsm(req: Request): any {
    const {
      outlet_id,
      area_id,
      wilayah_id,
      distributor_id,
      region_id,
    } = req.validated;
    const query = db()
      .select("ms_dist_pic.asm_id", "ms_pic.nama_pic")
      .distinct("ms_dist_pic.distributor_id")
      .from("ms_dist_pic")
      .innerJoin(
        "ms_outlet",
        "ms_dist_pic.distributor_id",
        "ms_outlet.distributor_id"
      )
      .innerJoin("ms_pic", "ms_dist_pic.ass_id", "ms_pic.kode_pic")
      .innerJoin("ms_region", "ms_outlet.region_id", "ms_region.region_id")
      .where({
        ...(outlet_id && { "ms_outlet.outlet_id": outlet_id }),
        ...(area_id && { "ms_outlet.area_id": area_id }),
        ...(region_id && { "ms_outlet.region_id": region_id }),
        ...(distributor_id && { "ms_outlet.distributor_id": distributor_id }),
        ...(wilayah_id && { "ms_region.head_region_id": wilayah_id }),
      })
      .orderBy("ms_dist_pic.asm_id");
    // console.log(query.toSQL().toNative());
    return query;
  }
  getAss(req: Request): any {
    const {
      outlet_id,
      area_id,
      wilayah_id,
      distributor_id,
      region_id,
    } = req.validated;
    const query = db()
      .select("ms_dist_pic.ass_id", "ms_pic.nama_pic")
      .distinct("ms_dist_pic.distributor_id")
      .from("ms_dist_pic")
      .innerJoin(
        "ms_outlet",
        "ms_dist_pic.distributor_id",
        "ms_outlet.distributor_id"
      )
      .innerJoin("ms_pic", "ms_dist_pic.ass_id", "ms_pic.kode_pic")
      .innerJoin("ms_region", "ms_outlet.region_id", "ms_region.region_id")
      .where({
        ...(outlet_id && { "ms_outlet.outlet_id": outlet_id }),
        ...(area_id && { "ms_outlet.area_id": area_id }),
        ...(region_id && { "ms_outlet.region_id": region_id }),
        ...(distributor_id && { "ms_outlet.distributor_id": distributor_id }),
        ...(wilayah_id && { "ms_region.head_region_id": wilayah_id }),
      })
      .orderBy("ms_dist_pic.ass_id");
    // console.log(query.toSQL().toNative());
    return query;
  }
  getSalesman(req: Request): any {
    const {
      outlet_id,
      area_id,
      wilayah_id,
      distributor_id,
      region_id,
      asm_id,
      ass_id,
    } = req.validated;
    const query = db()
      .distinct("ms_user.user_id")
      .select("ms_user.user_profile")
      .from("ms_user")
      .innerJoin("ms_user_scope", "ms_user.user_id", "ms_user_scope.user_id")
      .innerJoin("ms_outlet", "ms_user_scope.scope", "ms_outlet.outlet_id")
      .innerJoin("ms_region", "ms_outlet.region_id", "ms_region.region_id")
      .innerJoin(
        "ms_dist_pic",
        "ms_outlet.distributor_id",
        "ms_dist_pic.distributor_id"
      )
      .where({
        "ms_user.level": "salesman",
        ...(outlet_id && { "ms_outlet.outlet_id": outlet_id }),
        ...(area_id && { "ms_outlet.area_id": area_id }),
        ...(region_id && { "ms_outlet.region_id": region_id }),
        ...(distributor_id && { "ms_outlet.distributor_id": distributor_id }),
        ...(wilayah_id && { "ms_region.head_region_id": wilayah_id }),
        ...(asm_id && { "ms_dist_pic.asm_id": asm_id }),
        ...(ass_id && { "ms_dist_pic.ass_id": ass_id }),
      })
      .orderBy("ms_user.user_id");
    console.log(query.toSQL().toNative());
    return query;
  }
}

export default new Region();
