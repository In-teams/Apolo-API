import { Request } from "express";
import db from "../config/db";

class Area {
  get(req: Request): any {
    const { outlet_id, region_id, wilayah_id, distributor_id } = req.validated;
    const query = db()
      .select("ms_area.area_name")
      .distinct("ms_area.area_id")
      .from("ms_area")
      .innerJoin("ms_outlet", "ms_area.area_id", "ms_outlet.area_id")
      .innerJoin("ms_region", "ms_outlet.region_id", "ms_region.region_id")
      .where({
        ...(outlet_id && { "ms_outlet.outlet_id": outlet_id }),
        ...(region_id && { "ms_outlet.region_id": region_id }),
        ...(distributor_id && { "ms_outlet.distributor_id": distributor_id }),
        ...(wilayah_id && { "ms_region.head_region_id": wilayah_id }),
      }).orderBy('ms_area.area_id');
    // console.log(query.toSQL().toNative());
    return query;
  }
}

export default new Area();
