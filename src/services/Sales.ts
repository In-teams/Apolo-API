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
      salesman_id,
    } = req.validated;
    const query = db()
      .select()
      .sum("st.target_sales as total")
      .from("ms_sales_target as st")
      .innerJoin("ms_outlet as o", "st.outlet_id", "o.outlet_id")
      .innerJoin("ms_dist_pic as pic", "o.distributor_id", "pic.distributor_id")
      .innerJoin("ms_region as r", "o.region_id", "r.region_id")
      .innerJoin(
        "ms_head_region as hr",
        "r.head_region_id",
        "hr.head_region_id"
      )
      // .innerJoin("ms_user_scope", "ms_outlet.outlet_id", "ms_user_scope.scope")
      // .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
      .where({
        ...(month && { month_target: month }),
        ...(outlet_id && { "o.outlet_id": outlet_id }),
        ...(area_id && { "o.area_id": area_id }),
        ...(region_id && { "o.region_id": region_id }),
        ...(distributor_id && { "o.distributor_id": distributor_id }),
        ...(wilayah_id && { "r.head_region_id": wilayah_id }),
        ...(ass_id && { "pic.ass_id": ass_id }),
        ...(asm_id && { "pic.asm_id": asm_id }),
        // ...(salesman_id && { "ms_user.user_id": salesman_id }),
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
      salesman_id,
    } = req.validated;
    const query = db()
      .select()
      .sum("trb.sales as total")
      .from("trx_transaksi as tr")
      .innerJoin(
        "trx_transaksi_barang as trb",
        "tr.kd_transaksi",
        "trb.kd_transaksi"
      )
      .innerJoin("ms_outlet as o", "tr.no_id", "o.outlet_id")
      .innerJoin("ms_dist_pic as pic", "o.distributor_id", "pic.distributor_id")
      .innerJoin("ms_region as r", "o.region_id", "r.region_id")
      .innerJoin(
        "ms_head_region as hr",
        "r.head_region_id",
        "hr.head_region_id"
      )
      // .innerJoin("ms_user_scope", "ms_outlet.outlet_id", "ms_user_scope.scope")
      // .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
      .where({
        ...(outlet_id && { "o.outlet_id": outlet_id }),
        ...(area_id && { "o.area_id": area_id }),
        ...(region_id && { "o.region_id": region_id }),
        ...(distributor_id && { "o.distributor_id": distributor_id }),
        ...(wilayah_id && { "r.head_region_id": wilayah_id }),
        ...(ass_id && { "pic.ass_id": ass_id }),
        ...(asm_id && { "pic.asm_id": asm_id }),
        // ...(salesman_id && { "ms_user.user_id": salesman_id }),
      });
    if (month)
      query.andWhereRaw("MONTHNAME(trx_transaksi.tgl_transaksi) = ?", [month]);
    // console.log(query.toSQL().toNative().sql);
    return query;
  }
  getSummary(req: Request): any {
    const {
      outlet_id,
      area_id,
      wilayah_id,
      distributor_id,
      region_id,
      month,
      ass_id,
      asm_id,
      salesman_id,
    } = req.validated;
    const query = db()
      .select(
        "mhr.head_region_name as wilayah",
        this.getAktual(req)
          .where("r.head_region_id", "=", db().raw('mhr.head_region_id'))
          .as("aktual"),
        this.getTarget(req)
          .where("r.head_region_id", "=", db().raw('mhr.head_region_id'))
          .as("target"),
      )
      .from("ms_outlet as o")
      .innerJoin("ms_region as r", "o.region_id", "r.region_id")
      .innerJoin(
        "ms_head_region as mhr",
        "r.head_region_id",
        "mhr.head_region_id"
      )
      .innerJoin("ms_dist_pic as pic", "o.distributor_id", "pic.distributor_id")
      // .innerJoin("ms_user_scope", "o.outlet_id", "ms_user_scope.scope")
      // .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
      .where({
        ...(outlet_id && { "o.outlet_id": outlet_id }),
        ...(area_id && { "o.area_id": area_id }),
        ...(region_id && { "o.region_id": region_id }),
        ...(distributor_id && { "o.distributor_id": distributor_id }),
        ...(wilayah_id && { "r.head_region_id": wilayah_id }),
        ...(ass_id && { "pic.ass_id": ass_id }),
        ...(asm_id && { "pic.asm_id": asm_id }),
        // ...(salesman_id && { "ms_user.user_id": salesman_id }),
      });
    if (month)
      query.andWhereRaw("MONTHNAME(trx_transaksi.tgl_transaksi) = ?", [month]);
    query.groupBy("wilayah");
    console.log(query.toSQL().toNative().sql);
    return query;
  }
}

export default new Sales();
