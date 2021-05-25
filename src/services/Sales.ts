import { Request } from "express";
import db from "../config/db";

class Sales {
  getTarget(req: Request): any {
    const {
      outlet_id,
      area_id,
      wilayah_id,
      distributor_id,
      region_id,
      month,
      ass_id,
      asm_id,
      salesman_id
    } = req.validated;
    const query = db()
      .select()
      .sum("ms_sales_target.target_sales as total")
      .from("ms_sales_target")
      .innerJoin(
        "ms_outlet",
        "ms_sales_target.outlet_id",
        "ms_outlet.outlet_id"
      )
      .innerJoin(
        "ms_dist_pic",
        "ms_outlet.distributor_id",
        "ms_dist_pic.distributor_id"
      )
      .innerJoin("ms_region", "ms_outlet.region_id", "ms_region.region_id")
      .innerJoin("ms_user_scope", "ms_outlet.outlet_id", "ms_user_scope.scope")
      .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
      .where({
        month_target: month,
        ...(outlet_id && { "ms_outlet.outlet_id": outlet_id }),
        ...(area_id && { "ms_outlet.area_id": area_id }),
        ...(region_id && { "ms_outlet.region_id": region_id }),
        ...(distributor_id && { "ms_outlet.distributor_id": distributor_id }),
        ...(wilayah_id && { "ms_region.head_region_id": wilayah_id }),
        ...(ass_id && { "ms_dist_pic.ass_id": ass_id }),
        ...(asm_id && { "ms_dist_pic.asm_id": asm_id }),
        ...(salesman_id && { "ms_user.user_id": salesman_id }),
      });
    // console.log(query.toSQL().toNative());
    return query;
  }
  getAktual(req: Request): any {
    const {
      outlet_id,
      area_id,
      wilayah_id,
      distributor_id,
      region_id,
      month,
      ass_id,
      asm_id,
      salesman_id
    } = req.validated;
    const query = db()
      .select()
      .sum("trx_transaksi_barang.sales as total")
      .from("trx_transaksi")
      .innerJoin(
        "trx_transaksi_barang",
        "trx_transaksi.kd_transaksi",
        "trx_transaksi_barang.kd_transaksi"
      )
      .innerJoin("ms_outlet", "trx_transaksi.no_id", "ms_outlet.outlet_id")
      .innerJoin(
        "ms_dist_pic",
        "ms_outlet.distributor_id",
        "ms_dist_pic.distributor_id"
      )
      .innerJoin("ms_region", "ms_outlet.region_id", "ms_region.region_id")
      .innerJoin("ms_user_scope", "ms_outlet.outlet_id", "ms_user_scope.scope")
      .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
      .where({
        ...(outlet_id && { "ms_outlet.outlet_id": outlet_id }),
        ...(area_id && { "ms_outlet.area_id": area_id }),
        ...(region_id && { "ms_outlet.region_id": region_id }),
        ...(distributor_id && { "ms_outlet.distributor_id": distributor_id }),
        ...(wilayah_id && { "ms_region.head_region_id": wilayah_id }),
        ...(ass_id && { "ms_dist_pic.ass_id": ass_id }),
        ...(asm_id && { "ms_dist_pic.asm_id": asm_id }),
        ...(salesman_id && { "ms_user.user_id": salesman_id }),
      })
      .andWhereRaw("MONTHNAME(trx_transaksi.tgl_transaksi) = ?", [month]);
    console.log(query.toSQL().toNative().sql);
    return query;
  }
}

export default new Sales();
