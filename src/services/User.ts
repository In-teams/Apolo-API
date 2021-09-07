import { Request } from "express";
import db from "../config/db";

class Region {
  getAsm(req: Request): any {
    const {
      outlet_id,
      area_id,
      wilayah_id,
      distributor_id,
      region_id,
      ass_id, salesman_id
    } = req.validated;
    const {scope, level} = req.body.decoded
		let addWhere : string = ''
		if(level === "distributor_manager") addWhere = 'o.distributor_id'
		if(level === "region_manager") addWhere = 'o.region_id'
		if(level === "area_manager") addWhere = 'o.city_id_alias'
		if(level === "outlet_manager") addWhere = 'o.outlet_id'
    const query = db()
      .select("pic.nama_pic")
      .distinct("dp.asm_id")
      .from("ms_dist_pic as dp")
      .innerJoin(
        "mstr_outlet as o",
        "dp.distributor_id",
        "o.distributor_id"
      )
      .innerJoin("ms_user_scope as us", "o.outlet_id", "us.scope")
      .innerJoin("ms_pic as pic", "dp.asm_id", "pic.kode_pic")
      .innerJoin("ms_pulau_alias as r", "o.region_id", "r.pulau_id_alias")
      .where({
        ...(ass_id && { "dp.ass_id": ass_id }),
        ...(salesman_id && { "us.user_id": salesman_id }),
        ...(outlet_id && { "o.outlet_id": outlet_id }),
        ...(area_id && { "o.city_id_alias": area_id }),
        ...(region_id && { "o.region_id": region_id }),
        ...(distributor_id && { "o.distributor_id": distributor_id }),
        ...(wilayah_id && { "r.head_region_id": wilayah_id }),
      }).whereIn(addWhere, scope.split(','))
      .orderBy("dp.asm_id");
    return query;
  }
  getAss(req: Request): any {
    const {
      outlet_id,
      area_id,
      wilayah_id,
      distributor_id,
      region_id,
      asm_id, salesman_id
    } = req.validated;
    const {scope, level} = req.body.decoded
		let addWhere : string = ''
		if(level === "distributor_manager") addWhere = 'o.distributor_id'
		if(level === "region_manager") addWhere = 'o.region_id'
		if(level === "area_manager") addWhere = 'o.city_id_alias'
		if(level === "outlet_manager") addWhere = 'o.outlet_id'
    const query = db()
      .select("pic.nama_pic")
      .distinct("dp.ass_id")
      .from("ms_dist_pic as dp")
      .innerJoin(
        "mstr_outlet as o",
        "dp.distributor_id",
        "o.distributor_id"
      )
      .innerJoin("ms_user_scope as us", "o.outlet_id", "us.scope")
      .innerJoin("ms_pic as pic", "dp.ass_id", "pic.kode_pic")
      .innerJoin("ms_pulau_alias as r", "o.region_id", "r.pulau_id_alias")
      .where({
        ...(asm_id && { "dp.asm_id": asm_id }),
        ...(salesman_id && { "us.user_id": salesman_id }),
        ...(outlet_id && { "o.outlet_id": outlet_id }),
        ...(area_id && { "o.city_id_alias": area_id }),
        ...(region_id && { "o.region_id": region_id }),
        ...(distributor_id && { "o.distributor_id": distributor_id }),
        ...(wilayah_id && { "r.head_region_id": wilayah_id }),
      }).whereIn(addWhere, scope.split(','))
      .orderBy("dp.ass_id");
    return query;
  }
  getSalesman(req: Request): any {
    const {
      outlet_id,
      area_id,
      wilayah_id,
      distributor_id,
      region_id,
      asm_id,
      ass_id,
    } = req.validated;
    const query = db()
      .distinct("ms_user.user_id")
      .select("ms_user.user_profile")
      .from("ms_user")
      .innerJoin("ms_user_scope", "ms_user.user_id", "ms_user_scope.user_id")
      .innerJoin("ms_outlet", "ms_user_scope.scope", "ms_outlet.outlet_id")
      .innerJoin("ms_region", "ms_outlet.region_id", "ms_region.region_id")
      .innerJoin(
        "ms_dist_pic",
        "ms_outlet.distributor_id",
        "ms_dist_pic.distributor_id"
      )
      .where({
        "ms_user.level": "salesman",
        ...(outlet_id && { "ms_outlet.outlet_id": outlet_id }),
        ...(area_id && { "ms_outlet.area_id": area_id }),
        ...(region_id && { "ms_outlet.region_id": region_id }),
        ...(distributor_id && { "ms_outlet.distributor_id": distributor_id }),
        ...(wilayah_id && { "ms_region.head_region_id": wilayah_id }),
        ...(asm_id && { "ms_dist_pic.asm_id": asm_id }),
        ...(ass_id && { "ms_dist_pic.ass_id": ass_id }),
      })
      .orderBy("ms_user.user_id");
    console.log(query.toSQL().toNative());
    return query;
  }
}

export default new Region();
