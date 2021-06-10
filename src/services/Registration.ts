import { Request } from "express";
import db from "../config/db";
import OutletService from "./Outlet";

class Outlet {
  getRegistationSummaryByHeadRegion(req: Request): any {
    const {
      distributor_id,
      outlet_id,
      area_id,
      region_id,
      wilayah_id,
      ass_id,
      asm_id,
      salesman_id,
      sort,
    } = req.validated;
    const query = db()
      .select(
        "hr.head_region_name as wilayah",
        OutletService.getOutletCount(req)
          .whereIn("valid", ["No", "No+"])
          .where("r.head_region_id", "=", db().raw("hr.head_region_id"))
          .as("notregist")
      )
      .count("o.outlet_id as regist")
      .from("ms_outlet as o")
      .innerJoin("ms_region as r", "o.region_id", "r.region_id")
      .innerJoin(
        "ms_head_region as hr",
        "r.head_region_id",
        "hr.head_region_id"
      )
      // .innerJoin("ms_user_scope", "ms_outlet.outlet_id", "ms_user_scope.scope")
      // .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
      .innerJoin("ms_dist_pic as pic", "o.distributor_id", "pic.distributor_id")
      .whereNotIn("valid", ["No", "No+"])
      .andWhere({
        ...(distributor_id && { "o.distributor_id": distributor_id }),
        ...(outlet_id && { "o.outlet_id": outlet_id }),
        ...(area_id && { "o.area_id": area_id }),
        ...(region_id && { "o.region_id": region_id }),
        ...(wilayah_id && { "r.head_region_id": wilayah_id }),
        ...(ass_id && { "pic.ass_id": ass_id }),
        ...(asm_id && { "pic.asm_id": asm_id }),
        // ...(salesman_id && { "ms_user.user_id": salesman_id }),
      })
      .groupBy("hr.head_region_id")
      .orderBy("regist", sort);
    // console.log(query.toSQL().sql)
    return query;
  }

  getRegistrationSummary(req: Request): any {
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
      .select(OutletService.getOutletCount(req).as("total_outlet"))
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
        // ...(salesman_id && { "ms_user.user_id": salesman_id }),
      });
    return query;
  }
  getLastRegistration(req: Request): any {
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
      })
      .orderBy("ms_outlet.tgl_registrasi", "desc")
      .limit(5)
      .offset(0);
    return query;
  }
  async post(req: Request): Promise<any> {
    try {
      const {
        outlet_id,
        nama_konsumen,
        telepon1,
        nomor_rekening,
        nama_rekening,
        cabang_bank,
        kota_bank,
        nama_bank,
        type_file,
        filename,
        periode_id,
      } = req.validated;
      delete req.validated.path;
      return await db().transaction(async (trx) => {
        await trx("trx_file_registrasi").insert({
          outlet_id,
          filename,
          type_file,
          periode_id,
        });
        await trx("ms_outlet").where({ outlet_id }).update({
          cabang_bank,
          nomor_rekening,
          nama_rekening,
          nama_konsumen,
          nama_bank,
          telepon1,
          kota_bank,
        });
      });
      // return db()("trx_file_registrasi").insert(req.validated);
    } catch (error) {
      console.log(error, "<<<");
    }
  }
  async update(req: Request): Promise<any> {
    try {
      const {
        outlet_id,
        nama_konsumen,
        telepon1,
        nomor_rekening,
        nama_rekening,
        cabang_bank,
        kota_bank,
        nama_bank,
        type_file,
        filename,
        periode_id,
      } = req.validated;
      delete req.validated.path;
      return await db().transaction(async (trx) => {
        await trx("trx_file_registrasi")
          .where({ outlet_id, type_file, periode_id })
          .update({
            filename,
          });
        await trx("ms_outlet").where({ outlet_id }).update({
          cabang_bank,
          nomor_rekening,
          nama_rekening,
          nama_konsumen,
          nama_bank,
          telepon1,
          kota_bank,
        });
      });
      // return db()("trx_file_registrasi").insert(req.validated);
    } catch (error) {
      console.log(error, "<<<");
    }
  }
  getRegistrationForm(req: Request): any {
    const { outlet_id, periode_id, type_file } = req.validated;
    const query = db()
      .select("*")
      .from("trx_file_registrasi")
      .where({
        ...(outlet_id && { outlet_id }),
        ...(periode_id && { periode_id }),
        ...(type_file && { type_file }),
      });

    return query;
  }
}

export default new Outlet();
