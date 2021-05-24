import { Request } from "express";
import db from "../config/db";

class Outlet {
  get(req: Request): any {
    const { distributor_id, area_id, region_id, wilayah_id } = req.validated;
    const query = db()
      .select("ms_outlet.outlet_name")
      .distinct("ms_outlet.outlet_id")
      .from("ms_outlet")
      .innerJoin("ms_region", "ms_outlet.region_id", "ms_region.region_id")
      .where({
        ...(distributor_id && { "ms_outlet.distributor_id": distributor_id }),
        ...(area_id && { "ms_outlet.area_id": area_id }),
        ...(region_id && { "ms_outlet.region_id": region_id }),
        ...(wilayah_id && { "ms_region.head_region_id": wilayah_id }),
      })
      .orderBy("ms_outlet.outlet_id");
    // console.log(query.toSQL().toNative());
    return query;
  }
}

export default new Outlet();
