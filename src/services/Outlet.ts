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
      .select("ms_outlet.outlet_name")
      .distinct("ms_outlet.outlet_id")
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
  getCount(req: Request): any {
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
      .countDistinct("ms_outlet.outlet_id as total")
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
      });
    return query;
  }
  getOutletTActive(req: Request): any {
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
      .countDistinct("trx_transaksi.no_id as aktif")
      .from("trx_transaksi")
      .innerJoin(
        "trx_transaksi_barang",
        "trx_transaksi.kd_transaksi",
        "trx_transaksi_barang.kd_transaksi"
      )
      .innerJoin("ms_outlet", "trx_transaksi.no_id", "ms_outlet.outlet_id")
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
      });
    return query;
  }
  getOutletRegisterSummary(req: Request): any {
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
    const subquery = db()
      .select("")
      .count("ms_outlet.outlet_id as total")
      .from("ms_outlet")
      .innerJoin("ms_region", "ms_outlet.region_id", "ms_region.region_id")
      .innerJoin(
        "ms_dist_pic",
        "ms_outlet.distributor_id",
        "ms_dist_pic.distributor_id"
      )
      .whereIn("valid", ["No", "No+"])
      .andWhere({
        ...(distributor_id && { "ms_outlet.distributor_id": distributor_id }),
        ...(outlet_id && { "ms_outlet.outlet_id": outlet_id }),
        ...(area_id && { "ms_outlet.area_id": area_id }),
        ...(region_id && { "ms_outlet.region_id": region_id }),
        ...(wilayah_id && { "ms_region.head_region_id": wilayah_id }),
        ...(ass_id && { "ms_dist_pic.ass_id": ass_id }),
        ...(asm_id && { "ms_dist_pic.asm_id": asm_id }),
        ...(salesman_id && { "ms_user.user_id": salesman_id }),
      }).as("notregist");
    const query = db()
      .select("ms_head_region.head_region_name as wilayah" , subquery)
      .count("ms_outlet.outlet_id as regist")
      .from("ms_outlet")
      .innerJoin("ms_region", "ms_outlet.region_id", "ms_region.region_id")
      .innerJoin("ms_head_region", "ms_region.head_region_id", "ms_head_region.head_region_id")
      // .innerJoin("ms_user_scope", "ms_outlet.outlet_id", "ms_user_scope.scope")
      // .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
      .innerJoin(
        "ms_dist_pic",
        "ms_outlet.distributor_id",
        "ms_dist_pic.distributor_id"
      )
      .whereNotIn("valid", ["No", "No+"])
      .andWhere({
        ...(distributor_id && { "ms_outlet.distributor_id": distributor_id }),
        ...(outlet_id && { "ms_outlet.outlet_id": outlet_id }),
        ...(area_id && { "ms_outlet.area_id": area_id }),
        ...(region_id && { "ms_outlet.region_id": region_id }),
        ...(wilayah_id && { "ms_region.head_region_id": wilayah_id }),
        ...(ass_id && { "ms_dist_pic.ass_id": ass_id }),
        ...(asm_id && { "ms_dist_pic.asm_id": asm_id }),
        ...(salesman_id && { "ms_user.user_id": salesman_id }),
      }).groupBy("ms_head_region.head_region_id").orderBy("regist", sort);
      console.log(query.toSQL().sql)
    return query;
  }
  getOutletRegisterCount(req: Request): any {
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
      .countDistinct("ms_outlet.outlet_id as total")
      .from("ms_outlet")
      .innerJoin("ms_region", "ms_outlet.region_id", "ms_region.region_id")
      .innerJoin(
        "ms_dist_pic",
        "ms_outlet.distributor_id",
        "ms_dist_pic.distributor_id"
      )
      // .innerJoin("ms_user_scope", "ms_outlet.outlet_id", "ms_user_scope.scope")
      // .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
      .whereNotIn("valid", ["No", "No+"])
      .andWhere({
        ...(distributor_id && { "ms_outlet.distributor_id": distributor_id }),
        ...(outlet_id && { "ms_outlet.outlet_id": outlet_id }),
        ...(area_id && { "ms_outlet.area_id": area_id }),
        ...(region_id && { "ms_outlet.region_id": region_id }),
        ...(wilayah_id && { "ms_region.head_region_id": wilayah_id }),
        ...(ass_id && { "ms_dist_pic.ass_id": ass_id }),
        ...(asm_id && { "ms_dist_pic.asm_id": asm_id }),
        ...(salesman_id && { "ms_user.user_id": salesman_id }),
      });
    return query;
  }
  getLastOutletRegister(req: Request): any {
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
      .select("outlet_id", "tgl_registrasi", "outlet_name")
      .from("ms_outlet")
      .innerJoin("ms_region", "ms_outlet.region_id", "ms_region.region_id")
      .innerJoin(
        "ms_dist_pic",
        "ms_outlet.distributor_id",
        "ms_dist_pic.distributor_id"
      )
      // .innerJoin("ms_user_scope", "ms_outlet.outlet_id", "ms_user_scope.scope")
      // .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
      .whereNotIn("valid", ["No", "No+"])
      .whereNotNull("ms_outlet.tgl_registrasi")
      .andWhere({
        ...(distributor_id && { "ms_outlet.distributor_id": distributor_id }),
        ...(outlet_id && { "ms_outlet.outlet_id": outlet_id }),
        ...(area_id && { "ms_outlet.area_id": area_id }),
        ...(region_id && { "ms_outlet.region_id": region_id }),
        ...(wilayah_id && { "ms_region.head_region_id": wilayah_id }),
        ...(ass_id && { "ms_dist_pic.ass_id": ass_id }),
        ...(asm_id && { "ms_dist_pic.asm_id": asm_id }),
        ...(salesman_id && { "ms_user.user_id": salesman_id }),
      }).orderBy("ms_outlet.tgl_registrasi", "desc").limit(5).offset(0);
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
      .countDistinct("ms_outlet.outlet_id as total")
      .from("ms_outlet")
      .innerJoin("ms_region", "ms_outlet.region_id", "ms_region.region_id")
      .innerJoin(
        "ms_dist_pic",
        "ms_outlet.distributor_id",
        "ms_dist_pic.distributor_id"
      )
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
        ...(salesman_id && { "ms_user.user_id": salesman_id }),
      });
    return query;
  }
  getOutletPoint(req: Request): any {
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
      .sum("trx_transaksi_barang.point_satuan as perolehan")
      .from("trx_transaksi")
      .innerJoin(
        "trx_transaksi_barang",
        "trx_transaksi.kd_transaksi",
        "trx_transaksi_barang.kd_transaksi"
      )
      .innerJoin("ms_outlet", "trx_transaksi.no_id", "ms_outlet.outlet_id")
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
      });
    return query;
  }
  getOutletPointRedeem(req: Request): any {
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
      .select("trx_transaksi_redeem_barang.quantity as qty")
      .sum(
        "trx_transaksi_redeem_barang.point_satuan as penukaran"
      )
      .from("trx_transaksi_redeem")
      .innerJoin(
        "trx_transaksi_redeem_barang",
        "trx_transaksi_redeem.kd_transaksi",
        "trx_transaksi_redeem_barang.kd_transaksi"
      )
      .innerJoin("ms_outlet", "trx_transaksi_redeem.no_id", "ms_outlet.outlet_id")
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
      });
      console.log(query.toSQL().sql)
    return query;
  }
}

export default new Outlet();
