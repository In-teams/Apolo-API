import { Request } from "express";
import db from "../config/db";

class Distributor {
  get(req: Request): any {
    const { outlet_id, area_id, region_id, wilayah_id } = req.validated;
    const query = db()
      .select("ms_distributor.distributor_name")
      .distinct("ms_distributor.distributor_id")
      .from("ms_distributor")
      .innerJoin(
        "ms_outlet",
        "ms_distributor.distributor_id",
        "ms_outlet.distributor_id"
      )
      .where({
        ...(outlet_id && { "ms_outlet.outlet_id": outlet_id }),
        ...(area_id && { "ms_outlet.area_id": area_id }),
        ...(region_id && { "ms_outlet.region_id": region_id }),
        ...(wilayah_id && { "ms_region.head_region_id": wilayah_id }),
      })
      .orderBy("ms_distributor.distributor_id");
    // console.log(query.toSQL().toNative());
    return query;
  }
}

export default new Distributor();
