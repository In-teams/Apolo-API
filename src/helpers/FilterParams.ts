import {Request} from "express";

class filterParams {
  count(req: Request, query: string): { query: string; params: string[] } {
    const {
      outlet_id,
      area_id,
      wilayah_id,
      distributor_id,
      region_id,
      ass_id,
      asm_id,
      salesman_id,
    } = req.validated;
    const { scope, level } = req.decoded;
    let addWhere: string | null = null;
    const params: string[] = [];
    if (level === "4") addWhere = "ou.distributor_id";
    if (level === "2") addWhere = "ou.region_id";
    if (level === "3") addWhere = "ou.city_id_alias";
    if (level === "5") addWhere = "ou.outlet_id";

    if (addWhere) {
      query += " AND " + addWhere + " IN (?)";
      params.push(scope);
    }
    if (distributor_id) {
      query += " AND ou.distributor_id = ?";
      params.push(distributor_id);
    }
    if (region_id) {
      query += " AND ou.region_id = ?";
      params.push(region_id);
    }
    if (outlet_id) {
      query += " AND ou.outlet_id = ?";
      params.push(outlet_id);
    }
    if (area_id) {
      query += " AND ou.city_id_alias = ?";
      params.push(area_id);
    }
    if (wilayah_id) {
      query += " AND r.head_region_id = ?";
      params.push(wilayah_id);
    }
    if (ass_id) {
      query += " AND pic.ass_id = ?";
      params.push(ass_id);
    }
    if (asm_id) {
      query += " AND pic.asm_id = ?";
      params.push(asm_id);
    }

    return { query, params };
  }
  query(req: Request, query: string): { query: string; params: string[] } {
    const {
      outlet_id,
      area_id,
      wilayah_id,
      distributor_id,
      region_id,
      ass_id,
      asm_id,
      salesman_id,
    } = req.validated;
    const { scope, level } = req.decoded;
    let addWhere: string | null = null;
    const params: string[] = [];
    if (level === "4") addWhere = "o.distributor_id";
    if (level === "2") addWhere = "o.region_id";
    if (level === "3") addWhere = "o.city_id_alias";
    if (level === "5") addWhere = "o.outlet_id";

    if (addWhere) {
      query += " AND " + addWhere + " IN (?)";
      params.push(scope);
    }
    if (distributor_id) {
      query += " AND o.distributor_id = ?";
      params.push(distributor_id);
    }
    if (region_id) {
      query += " AND o.region_id = ?";
      params.push(region_id);
    }
    if (outlet_id) {
      query += " AND o.outlet_id = ?";
      params.push(outlet_id);
    }
    if (area_id) {
      query += " AND o.city_id_alias = ?";
      params.push(area_id);
    }
    if (wilayah_id) {
      query += " AND reg.head_region_id = ?";
      params.push(wilayah_id);
    }
    if (ass_id) {
      query += " AND dp.ass_id = ?";
      params.push(ass_id);
    }
    if (asm_id) {
      query += " AND dp.asm_id = ?";
      params.push(asm_id);
    }

    return { query, params };
  }
  register(
    req: Request,
    query: string,
    isMonthQuarter = true
  ): { query: string; params: string[] } {
    const {
      outlet_id,
      area_id,
      wilayah_id,
      distributor_id,
      region_id,
      ass_id,
      asm_id,
      salesman_id,
      month_id,
      quarter_id,
    } = req.validated;
    const { scope, level } = req.decoded;
    let addWhere: string | null = null;
    const params: string[] = [];
    if (level === "4") addWhere = "o.distributor_id";
    if (level === "2") addWhere = "o.region_id";
    if (level === "3") addWhere = "o.city_id_alias";
    if (level === "5") addWhere = "o.outlet_id";

    if (addWhere) {
      query += " AND " + addWhere + " IN (?)";
      params.push(scope);
    }
    if (distributor_id) {
      query += " AND o.distributor_id = ?";
      params.push(distributor_id);
    }
    if (region_id) {
      query += " AND o.region_id = ?";
      params.push(region_id);
    }
    if (outlet_id) {
      query += " AND o.outlet_id = ?";
      params.push(outlet_id);
    }
    if (area_id) {
      query += " AND o.city_id_alias = ?";
      params.push(area_id);
    }
    if (wilayah_id) {
      query += " AND reg.head_region_id = ?";
      params.push(wilayah_id);
    }
    if (ass_id) {
      query += " AND dp.ass_id = ?";
      params.push(ass_id);
    }
    if (asm_id) {
      query += " AND dp.asm_id = ?";
      params.push(asm_id);
    }
    if (isMonthQuarter) {
      if (month_id) {
        query += " AND MONTH(rf.tgl_upload) = ?";
        params.push(month_id);
      }
      if (quarter_id) {
        query += " AND MONTH(rf.tgl_upload) IN(?)";
        params.push(quarter_id);
      }
    }

    return { query, params };
  }
  target(req: Request, query: string) {
    const {
      month_id,
      quarter_id,
      outlet_id,
      area_id,
      wilayah_id,
      distributor_id,
      region_id,
      ass_id,
      asm_id,
    } = req.validated;
    const { scope, level } = req.decoded;
    let addWhere: string | null = null;
    const params: string[] = [];
    if (level === "4") addWhere = "ou.distributor_id";
    if (level === "2") addWhere = "ou.region_id";
    if (level === "3") addWhere = "ou.city_id_alias";
    if (level === "5") addWhere = "ou.outlet_id";

    if (addWhere) {
      query += " AND " + addWhere + " IN (?)";
      params.push(scope);
    }
    if (distributor_id) {
      query += " AND ou.distributor_id = ?";
      params.push(distributor_id);
    }
    if (region_id) {
      query += " AND ou.region_id = ?";
      params.push(region_id);
    }
    if (outlet_id) {
      query += " AND ou.outlet_id = ?";
      params.push(outlet_id);
    }
    if (area_id) {
      query += " AND ou.city_id_alias = ?";
      params.push(area_id);
    }
    if (wilayah_id) {
      query += " AND r.head_region_id = ?";
      params.push(wilayah_id);
    }
    if (ass_id) {
      query += " AND pic.ass_id = ?";
      params.push(ass_id);
    }
    if (asm_id) {
      query += " AND pic.asm_id = ?";
      params.push(asm_id);
    }
    if (month_id) {
      query += " AND b.id = ?";
      params.push(month_id);
    }
    if (quarter_id) {
      query += " AND b.id IN (?)";
      params.push(quarter_id);
    }

    return { query, params };
  }
  aktual(req: Request, query: string) {
    const {
      month_id,
      quarter_id,
      outlet_id,
      area_id,
      wilayah_id,
      distributor_id,
      region_id,
      ass_id,
      asm_id,
    } = req.validated;
    const { scope, level } = req.decoded;
    let addWhere: string | null = null;
    const params: string[] = [];
    if (level === "4") addWhere = "ou.distributor_id";
    if (level === "2") addWhere = "ou.region_id";
    if (level === "3") addWhere = "ou.city_id_alias";
    if (level === "5") addWhere = "ou.outlet_id";

    if (addWhere) {
      query += " AND " + addWhere + " IN (?)";
      params.push(scope);
    }
    if (distributor_id) {
      query += " AND ou.distributor_id = ?";
      params.push(distributor_id);
    }
    if (region_id) {
      query += " AND ou.region_id = ?";
      params.push(region_id);
    }
    if (outlet_id) {
      query += " AND ou.outlet_id = ?";
      params.push(outlet_id);
    }
    if (area_id) {
      query += " AND ou.city_id_alias = ?";
      params.push(area_id);
    }
    if (wilayah_id) {
      query += " AND r.head_region_id = ?";
      params.push(wilayah_id);
    }
    if (ass_id) {
      query += " AND pic.ass_id = ?";
      params.push(ass_id);
    }
    if (asm_id) {
      query += " AND pic.asm_id = ?";
      params.push(asm_id);
    }
    if (month_id) {
      query += " AND MONTH(tr.tgl_transaksi) = ?";
      params.push(month_id);
    }
    if (quarter_id) {
      query += " AND MONTH(tr.tgl_transaksi) IN (?)";
      params.push(quarter_id);
    }

    return { query, params };
  }
  alamat(data: any, query: string) {
    const { province, city, district, subdistrict } = data;
    const params: string[] = [];

    if (province) {
      query += " AND p.name = ?";
      params.push(province);
    }
    if (city) {
      query += " AND c.name = ?";
      params.push(city);
    }
    if (district) {
      query += " AND d.name = ?";
      params.push(district);
    }
    if (subdistrict) {
      query += " AND sd.name = ?";
      params.push(subdistrict);
    }

    return { query, params };
  }
  sales(query: string, data: any) {
    const {
      outlet_id,
      area_id,
      wilayah_id,
      distributor_id,
      region_id,
      ass_id,
      asm_id,
      kd_category,
      brand_id,
      sub_brand_id,
    } = data;

    if (distributor_id) {
      query += " AND o.distributor_id = :distributor_id";
    }
    if (region_id) {
      query += " AND o.region_id = :region_id";
    }
    if (outlet_id) {
      query += " AND o.outlet_id = :outlet_id";
    }
    if (area_id) {
      query += " AND o.city_id_alias = :area_id";
    }
    if (wilayah_id) {
      query += " AND r.head_region_id = :wilayah_id";
    }
    if (ass_id) {
      query += " AND pic.ass_id = :ass_id";
    }
    if (asm_id) {
      query += " AND pic.asm_id = :asm_id";
    }

    if (kd_category) {
      query += " AND trb.kd_category = :kd_category";
    }

    if (brand_id) {
      query += " AND trb.brand_id = :brand_id";
    }

    if (sub_brand_id) {
      query += " AND trb.sub_brand_id = :sub_brand_id";
    }

    return query;
  }
}

export default new filterParams();
