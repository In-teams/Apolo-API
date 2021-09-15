import { Request } from "express";
import { QueryTypes } from "sequelize";
import db from "../config/db";

class Outlet {
  update(req: Request): any {
    const {outlet_id} = req.validated
    // return db()("ms_outlet").where({outlet_id}).update()
  }
  async get(req: Request): Promise<any> {
    let {
        outlet_id,
        area_id,
        wilayah_id,
        distributor_id,
        region_id,
        ass_id,
        asm_id,
        salesman_id,
    } = req.validated;
    const { scope, level } = req.body.decoded;
    let addWhere: string | null = null;
    let params: string[] = [];
    if (level === '4') addWhere = 'o.distributor_id';
    if (level === '2') addWhere = 'o.region_id';
    if (level === '3') addWhere = 'o.city_id_alias';
    if (level === '5') addWhere = 'o.outlet_id';

    let query =
        'select distinct o.* from mstr_outlet as o INNER JOIN ms_pulau_alias as r on o.region_id = r.pulau_id_alias INNER JOIN ms_user_scope as us on o.outlet_id = us.scope INNER JOIN ms_dist_pic as dp on o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL';

    if (addWhere) {
        query += ' AND ' + addWhere + ' IN (?)';
        params.push(scope);
    }
    if (distributor_id) {
        query += ' AND o.distributor_id = ?';
        params.push(distributor_id);
    }
    if (region_id) {
        query += ' AND o.region_id = ?';
        params.push(region_id);
    }
    if (outlet_id) {
        query += ' AND o.outlet_id = ?';
        params.push(outlet_id);
    }
    if (area_id) {
        query += ' AND o.city_id_alias = ?';
        params.push(area_id);
    }
    if (wilayah_id) {
        query += ' AND r.head_region_id = ?';
        params.push(wilayah_id);
    }
    if (ass_id) {
        query += ' AND dp.ass_id = ?';
        params.push(ass_id);
    }
    if (asm_id) {
        query += ' AND dp.asm_id = ?';
        params.push(asm_id);
    }

    return await db.query(query + ' order by o.outlet_id ASC', {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: params,
    });
  }
  getOutletActive(req: Request): any {
    // const {
    //   distributor_id,
    //   outlet_id,
    //   area_id,
    //   region_id,
    //   wilayah_id,
    //   ass_id,
    //   asm_id,
    //   salesman_id,
    // } = req.validated;
    // const {scope, level} = req.body.decoded
		// let addWhere : string = ''
		// if(level === "distributor_manager") addWhere = 'o.distributor_id'
		// if(level === "region_manager") addWhere = 'o.region_id'
		// if(level === "area_manager") addWhere = 'o.city_id_alias'
		// if(level === "outlet_manager") addWhere = 'o.outlet_id'
    // const query = db()
    //   .select(this.getOutletCount(req).as("total_outlet"))
    //   .countDistinct("tr.no_id as aktif")
    //   .from("trx_transaksi as tr")
    //   .innerJoin(
    //     "trx_transaksi_barang as trb",
    //     "tr.kd_transaksi",
    //     "trb.kd_transaksi"
    //   )
    //   .innerJoin("mstr_outlet as o", "tr.no_id", "o.outlet_id")
    //   .innerJoin("ms_pulau_alias as r", "o.region_id", "r.pulau_id_alias")
    //   .innerJoin("ms_user_scope as us", "o.outlet_id", "us.scope")
    //   .innerJoin(
    //     "ms_dist_pic as pic",
    //     "o.distributor_id",
    //     "pic.distributor_id"
    //   )
    //   // .innerJoin("ms_user_scope", "ms_outlet.outlet_id", "ms_user_scope.scope")
    //   // .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
    //   .where({
    //     ...(distributor_id && { "o.distributor_id": distributor_id }),
    //     ...(outlet_id && { "o.outlet_id": outlet_id }),
    //     ...(area_id && { "o.city_id_alias": area_id }),
    //     ...(region_id && { "o.region_id": region_id }),
    //     ...(wilayah_id && { "r.head_region_id": wilayah_id }),
    //     ...(ass_id && { "pic.ass_id": ass_id }),
    //     ...(asm_id && { "pic.asm_id": asm_id }),
    //     // ...(salesman_id && { "ms_user.user_id": salesman_id }),
    //   }).whereIn(addWhere, scope.split(','));
    // return query;
  }

  getOutletCount(req: Request): any {
    // const {
    //   distributor_id,
    //   outlet_id,
    //   area_id,
    //   region_id,
    //   wilayah_id,
    //   ass_id,
    //   asm_id,
    //   salesman_id,
    // } = req.validated;
    // const {scope, level} = req.body.decoded
		// let addWhere : string = ''
		// if(level === "distributor_manager") addWhere = 'o.distributor_id'
		// if(level === "region_manager") addWhere = 'o.region_id'
		// if(level === "area_manager") addWhere = 'o.city_id_alias'
		// if(level === "outlet_manager") addWhere = 'o.outlet_id'
    // const query = db()
    //   .select("")
    //   .countDistinct("o.outlet_id as total")
    //   .from("mstr_outlet as o")
    //   .innerJoin("ms_pulau_alias as r", "o.region_id", "r.pulau_id_alias")
    //   // .innerJoin("ms_user_scope as us", "o.outlet_id", "us.scope")
    //   .innerJoin(
    //     "ms_dist_pic as pic",
    //     "o.distributor_id",
    //     "pic.distributor_id"
    //   )
    //   // .innerJoin("ms_user", "ms_user_scope.user_id", "ms_user.user_id")
    //   .where({
    //     ...(distributor_id && { "o.distributor_id": distributor_id }),
    //     ...(outlet_id && { "o.outlet_id": outlet_id }),
    //     ...(area_id && { "o.city_id_alias": area_id }),
    //     ...(region_id && { "o.region_id": region_id }),
    //     ...(wilayah_id && { "r.head_region_id": wilayah_id }),
    //     ...(ass_id && { "pic.ass_id": ass_id }),
    //     ...(asm_id && { "pic.asm_id": asm_id }),
    //     // ...(salesman_id && { "ms_user.user_id": salesman_id }),
    //   }).whereIn(addWhere, scope.split(','))
    // return query;
  }
}

export default new Outlet();
