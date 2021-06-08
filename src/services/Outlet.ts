import { Request } from "express";
import db from "../config/db";

class Outlet {
  get(req: Request): any {
    const {
      distributor_id,
      outlet_id,
      area_id,
      region_id,
      wilayah_id,
      ass_id,
      asm_id,
      salesman_id,
    } = req.validated;
    const query = db()
      .select("")
      .distinct("ms_outlet.*")
      .from("ms_outlet")
      .innerJoin("ms_region", "ms_outlet.region_id", "ms_region.region_id")
      .innerJoin(
        "ms_dist_pic",
        "ms_outlet.distributor_id",
        "ms_dist_pic.distributor_id"
      )
      .innerJoin("ms_user_scope", "ms_outlet.outlet_id", "ms_user_scope.scope")
      .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
      .where({
        ...(distributor_id && { "ms_outlet.distributor_id": distributor_id }),
        ...(outlet_id && { "ms_outlet.outlet_id": outlet_id }),
        ...(area_id && { "ms_outlet.area_id": area_id }),
        ...(region_id && { "ms_outlet.region_id": region_id }),
        ...(wilayah_id && { "ms_region.head_region_id": wilayah_id }),
        ...(ass_id && { "ms_dist_pic.ass_id": ass_id }),
        ...(asm_id && { "ms_dist_pic.asm_id": asm_id }),
        ...(salesman_id && { "ms_user.user_id": salesman_id }),
      })
      .orderBy("ms_outlet.outlet_id");
    // console.log(query.toSQL().toNative().sql);
    return query;
  }
  getOutletActive(req: Request): any {
    const {
      distributor_id,
      outlet_id,
      area_id,
      region_id,
      wilayah_id,
      ass_id,
      asm_id,
      salesman_id,
    } = req.validated;
    const query = db()
      .select(this.getOutletCount(req).as("total_outlet"))
      .countDistinct("tr.no_id as aktif")
      .from("trx_transaksi as tr")
      .innerJoin(
        "trx_transaksi_barang as trb",
        "tr.kd_transaksi",
        "trb.kd_transaksi"
      )
      .innerJoin("ms_outlet as o", "tr.no_id", "o.outlet_id")
      .innerJoin("ms_region as r", "o.region_id", "r.region_id")
      .innerJoin("ms_dist_pic as pic", "o.distributor_id", "pic.distributor_id")
      // .innerJoin("ms_user_scope", "ms_outlet.outlet_id", "ms_user_scope.scope")
      // .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
      .where({
        ...(distributor_id && { "o.distributor_id": distributor_id }),
        ...(outlet_id && { "o.outlet_id": outlet_id }),
        ...(area_id && { "o.area_id": area_id }),
        ...(region_id && { "o.region_id": region_id }),
        ...(wilayah_id && { "r.head_region_id": wilayah_id }),
        ...(ass_id && { "pic.ass_id": ass_id }),
        ...(asm_id && { "pic.asm_id": asm_id }),
        // ...(salesman_id && { "ms_user.user_id": salesman_id }),
      });
    return query;
  }

  getOutletCount(req: Request): any {
    const {
      distributor_id,
      outlet_id,
      area_id,
      region_id,
      wilayah_id,
      ass_id,
      asm_id,
      salesman_id,
    } = req.validated;
    const query = db()
      .select("")
      .countDistinct("o.outlet_id as total")
      .from("ms_outlet as o")
      .innerJoin("ms_region as r", "o.region_id", "r.region_id")
      .innerJoin("ms_dist_pic as pic", "o.distributor_id", "pic.distributor_id")
      // .innerJoin("ms_user_scope", "ms_outlet.outlet_id", "ms_user_scope.scope")
      // .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
      .where({
        ...(distributor_id && { "o.distributor_id": distributor_id }),
        ...(outlet_id && { "o.outlet_id": outlet_id }),
        ...(area_id && { "o.area_id": area_id }),
        ...(region_id && { "o.region_id": region_id }),
        ...(wilayah_id && { "r.head_region_id": wilayah_id }),
        ...(ass_id && { "pic.ass_id": ass_id }),
        ...(asm_id && { "pic.asm_id": asm_id }),
        // ...(salesman_id && { "ms_user.user_id": salesman_id }),
      });
    return query;
  }
}

export default new Outlet();
