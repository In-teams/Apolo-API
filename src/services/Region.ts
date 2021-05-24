import { Request } from "express";
import db from "../config/db";

class Region {
  get(req: Request): any {
    const { outlet_id, area_id, wilayah_id, distributor_id } = req.validated;
    const query = db()
      .select("ms_region.region_name")
      .distinct("ms_region.region_id")
      .from("ms_region")
      .innerJoin("ms_outlet", "ms_region.region_id", "ms_outlet.region_id")
      .where({
        ...(outlet_id && { "ms_outlet.outlet_id": outlet_id }),
        ...(area_id && { "ms_outlet.area_id": area_id }),
        ...(distributor_id && { "ms_outlet.distributor_id": distributor_id }),
        ...(wilayah_id && { "ms_region.head_region_id": wilayah_id }),
      }).orderBy('ms_region.region_id');
    // console.log(query.toSQL().toNative());
    return query;
  }
}

export default new Region();
