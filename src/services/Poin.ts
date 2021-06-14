import { Request } from "express";
import db from "../config/db";

class Outlet {
  getPoint(req: Request): any {
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
      .sum("trb.point_satuan as perolehan")
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
  getPointRedeem(req: Request): any {
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
      .select(db().raw("SUM(trrb.point_satuan * trrb.quantity) as redeem"))
      .from("trx_transaksi_redeem as trr")
      .innerJoin(
        "trx_transaksi_redeem_barang as trrb",
        "trr.kd_transaksi",
        "trrb.kd_transaksi"
      )
      .innerJoin("ms_outlet as o", "trr.no_id", "o.outlet_id")
      .innerJoin("ms_region as r", "o.region_id", "r.region_id")
      .innerJoin("ms_dist_pic as pic", "o.distributor_id", "pic.distributor_id")
      // .innerJoin("ms_user_scope", "ms_outlet.outlet_id", "ms_user_scope.scope")
      // .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
      .where({
        ...(distributor_id && { "o.distributor_id": distributor_id }),
        ...(outlet_id && { "o.outlet_id": outlet_id }),
        ...(area_id && { "o.area_id": area_id }),
        ...(region_id && { "o.region_id": region_id }),
        ...(wilayah_id && { "o.head_region_id": wilayah_id }),
        ...(ass_id && { "pic.ass_id": ass_id }),
        ...(asm_id && { "pic.asm_id": asm_id }),
        // ...(salesman_id && { "ms_user.user_id": salesman_id }),
      });
    return query;
  }
  getPointSummary(req: Request): any {
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
      .distinct(
        this.getPoint(req).as("achieve"),
        this.getPointRedeem(req).as("redeem")
      )
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
    // console.log(query.toSQL().sql);
    return query;
  }
  getPointSummaryByHR(req: Request): any {
    const {
      distributor_id,
      outlet_id,
      area_id,
      region_id,
      wilayah_id,
      ass_id,
      asm_id,
      salesman_id,
      sort
    } = req.validated;
    const query = db()
      .select(
        "hr.head_region_name as wilayah",
        this.getPoint(req)
          .where("r.head_region_id", "=", db().raw("hr.head_region_id"))
          .as("achieve"),
        this.getPointRedeem(req)
          .where("r.head_region_id", "=", db().raw("hr.head_region_id"))
          .as("redeem")
      )
      .from("ms_outlet as o")
      .innerJoin("ms_region as r", "o.region_id", "r.region_id")
      .innerJoin(
        "ms_head_region as hr",
        "r.head_region_id",
        "hr.head_region_id"
      )
      .innerJoin("ms_dist_pic as pic", "o.distributor_id", "pic.distributor_id")
      // .innerJoin("ms_user_scope", "ms_outlet.outlet_id", "ms_user_scope.scope")
      // .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
      .where({
        ...(distributor_id && { "ms_outlet.distributor_id": distributor_id }),
        ...(outlet_id && { "ms_outlet.outlet_id": outlet_id }),
        ...(area_id && { "ms_outlet.area_id": area_id }),
        ...(region_id && { "ms_outlet.region_id": region_id }),
        ...(wilayah_id && { "ms_region.head_region_id": wilayah_id }),
        ...(ass_id && { "ms_dist_pic.ass_id": ass_id }),
        ...(asm_id && { "ms_dist_pic.asm_id": asm_id }),
        // ...(salesman_id && { "ms_user.user_id": salesman_id }),
      })
      .groupBy("wilayah").orderBy("achieve", sort);
    // console.log(query.toSQL().sql);
    return query;
  }
}

export default new Outlet();
