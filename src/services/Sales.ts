import { Request } from "express";
import { QueryTypes } from "sequelize";
import db from "../config/db";
import filterParams from "../helpers/FilterParams";
import salesByHirarki from "../types/SalesInterface";

const queryTarget: string =
  "SELECT SUM(st.target_sales) AS target FROM ( SELECT * FROM mstr_sales_target UNION SELECT * FROM mstr_sales_target2 UNION SELECT * FROM mstr_sales_target3 UNION SELECT * FROM mstr_sales_target4 ) AS st INNER JOIN mstr_outlet AS ou ON ou.outlet_id = st.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_bulan AS b ON b.bulan = st.month_target WHERE st.outlet_id IS NOT NULL";
let queryTargetByOutlet: string =
  "SELECT SUM(st.target_sales) AS target, st.outlet_id, b.id AS bulan FROM ( SELECT * FROM mstr_sales_target UNION SELECT * FROM mstr_sales_target2 UNION SELECT * FROM mstr_sales_target3 UNION SELECT * FROM mstr_sales_target4 ) AS st INNER JOIN mstr_outlet AS ou ON ou.outlet_id = st.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_bulan AS b ON b.bulan = st.month_target WHERE st.outlet_id IS NOT NULL";

const queryAktual: string =
  "SELECT SUM(trb.sales) AS aktual FROM trx_transaksi tr INNER JOIN trx_transaksi_barang trb ON trb.kd_transaksi = tr.kd_transaksi INNER JOIN mstr_outlet AS ou ON ou.outlet_id = tr.no_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id WHERE ou.outlet_id IS NOT NULL";

let queryAktualAndPoint: string =
  "SELECT ou.outlet_id, MONTH(tr.tgl_transaksi) AS bulan, SUM(sales) AS aktual, SUM(point_satuan) AS poin FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.kd_transaksi = trb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_head_region AS hr ON r.head_region_id = hr.head_region_id WHERE ou.outlet_id IS NOT NULL";

let queryOutletCount =
  "SELECT COUNT(DISTINCT ou.outlet_id) AS total FROM mstr_outlet AS ou INNER JOIN ms_pulau_alias AS r ON ou.`region_id` = r. `pulau_id_alias` INNER JOIN ms_dist_pic AS pic ON ou.`distributor_id` = pic.`distributor_id` WHERE ou.`outlet_id` IS NOT NULL";

class Sales {
  async getOutletCount(req: Request): Promise<{ target: number }[]> {
    let { query: newQuery, params } = filterParams.count(req, queryOutletCount);

    return await db.query(newQuery, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: params,
    });
  }
  async getTarget(req: Request): Promise<{ target: number }[]> {
    let query =
      "SELECT SUM(st.target_sales) AS target FROM ( SELECT * FROM mstr_sales_target UNION SELECT * FROM mstr_sales_target2 UNION SELECT * FROM mstr_sales_target3 UNION SELECT * FROM mstr_sales_target4 ) AS st INNER JOIN mstr_outlet AS ou ON ou.outlet_id = st.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_bulan AS b ON b.bulan = st.month_target WHERE st.outlet_id IS NOT NULL";
    let { query: q, params: p } = filterParams.target(req, query);

    return await db.query(q, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...p],
    });
  }
  async getSalesByDistributor(req: Request): Promise<salesByHirarki[]> {
    const { sort } = req.validated;
    let qTarget = queryTarget + " AND ou.`distributor_id` = d.`distributor_id`";
    let qAktual = queryAktual + " AND ou.`distributor_id` = d.`distributor_id`";

    let { query: qt, params: pt } = filterParams.target(req, qTarget);
    let { query: qa, params: pa } = filterParams.aktual(req, qAktual);

    let query = `SELECT d.distributor_name as distributor, d.distributor_id, (${qt}) AS target, (${qa}) AS aktual, (TRUNCATE(((${qa})/(${qt})* 100), 2 )) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN mstr_distributor as d ON d.distributor_id = o.distributor_id INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE d.distributor_id IS NOT NULL`;

    let { query: newQuery, params }: { query: string; params: string[] } =
      filterParams.query(req, query);

    newQuery += ` GROUP BY d.distributor_id ORDER BY pencapaian ${sort} LIMIT 5`;

    return await db.query(newQuery, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...pt, ...pa, ...pt, ...pa, ...params],
    });
  }
  async getSalesByArea(req: Request): Promise<salesByHirarki[]> {
    const { sort } = req.validated;
    let qTarget = queryTarget + " AND ou.city_id_alias = ci.city_id_alias";
    let qAktual = queryAktual + " AND ou.city_id_alias = ci.city_id_alias";

    let { query: qt, params: pt } = filterParams.target(req, qTarget);
    let { query: qa, params: pa } = filterParams.aktual(req, qAktual);

    let query = `SELECT ci.city_name_alias as city, (${qt}) AS target, (${qa}) AS aktual, (TRUNCATE(((${qAktual})/(${qt})* 100), 2 )) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN ms_city_alias as ci ON ci.city_id_alias = o.city_id_alias INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE ci.city_id_alias IS NOT NULL`;

    let { query: newQuery, params }: { query: string; params: string[] } =
      filterParams.query(req, query);

    newQuery += ` GROUP BY ci.city_id_alias ORDER BY pencapaian ${sort} LIMIT 5`;

    return await db.query(newQuery, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...pt, ...pa, ...pt, ...pa, ...params],
    });
  }
  async getSalesByOutlet(req: Request): Promise<salesByHirarki[]> {
    const { sort } = req.validated;
    let qTarget = queryTarget + " AND ou.outlet_id = o.outlet_id";
    let qAktual = queryAktual + " AND ou.outlet_id = o.outlet_id";

    let { query: qt, params: pt } = filterParams.target(req, qTarget);
    let { query: qa, params: pa } = filterParams.aktual(req, qAktual);

    // console.log(qt)

    let query = `SELECT o.outlet_name as outlet_name, (${qt}) AS target, (${qa}) AS aktual, (TRUNCATE(((${qa})/(${qt})* 100), 2 )) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`;

    let { query: newQuery, params }: { query: string; params: string[] } =
      filterParams.query(req, query);

    newQuery += ` GROUP BY o.outlet_id ORDER BY pencapaian ${sort} LIMIT 5`;

    return await db.query(newQuery, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...pt, ...pa, ...pt, ...pa, ...params],
    });
  }
  async getSalesByRegion(req: Request): Promise<salesByHirarki[]> {
    const { sort } = req.validated;
    let qTarget = queryTarget + " AND ou.region_id = reg.pulau_id_alias";
    let qAktual = queryAktual + " AND ou.region_id = reg.pulau_id_alias";

    let { query: qt, params: pt } = filterParams.target(req, qTarget);
    let { query: qa, params: pa } = filterParams.aktual(req, qAktual);

    let query = `SELECT reg.nama_pulau_alias AS region, (${qt}) AS target, (${qa}) AS aktual, (TRUNCATE(((${qa})/(${qt})* 100), 2 )) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE reg.pulau_id_alias IS NOT NULL`;

    let { query: newQuery, params }: { query: string; params: string[] } =
      filterParams.query(req, query);

    newQuery += ` GROUP BY reg.pulau_id_alias ORDER BY pencapaian ${sort} LIMIT 5`;

    return await db.query(newQuery, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...pt, ...pa, ...pt, ...pa, ...params],
    });
  }
  async getSalesByHR(req: Request): Promise<salesByHirarki[]> {
    const { sort } = req.validated;
    let qTarget = queryTarget + " AND r.head_region_id = mhr.head_region_id";
    let qAktual = queryAktual + " AND r.head_region_id = mhr.head_region_id";

    let { query: qt, params: pt } = filterParams.target(req, qTarget);
    let { query: qa, params: pa } = filterParams.aktual(req, qAktual);

    let query = `SELECT mhr.head_region_name AS wilayah, mhr.head_region_id AS wilayah_id, (${qt}) AS target, (${qa}) AS aktual, (TRUNCATE(((${qa})/(${qt})* 100), 2 )) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE mhr.head_region_id IS NOT NULL`;

    let { query: newQuery, params }: { query: string; params: string[] } =
      filterParams.query(req, query);

    newQuery += ` GROUP BY mhr.head_region_id ORDER BY pencapaian ${sort} LIMIT 5`;

    return await db.query(newQuery, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...pt, ...pa, ...pt, ...pa, ...params],
    });
  }
  async getSalesByASM(req: Request): Promise<salesByHirarki[]> {
    const { sort } = req.validated;
    let qTarget = queryTarget + " AND pic.asm_id = mp.kode_pic";
    let qAktual = queryAktual + " AND pic.asm_id = mp.kode_pic";

    let { query: qt, params: pt } = filterParams.target(req, qTarget);
    let { query: qa, params: pa } = filterParams.aktual(req, qAktual);

    let query = `SELECT mp.nama_pic as nama_pic, (${qt}) AS target, (${qa}) AS aktual, (TRUNCATE(((${qa})/(${qt})* 100), 2 )) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_pic as mp ON mp.kode_pic = dp.asm_id WHERE mp.kode_pic IS NOT NULL`;

    let { query: newQuery, params }: { query: string; params: string[] } =
      filterParams.query(req, query);

    newQuery += ` GROUP BY mp.kode_pic ORDER BY pencapaian ${sort} LIMIT 5`;

    return await db.query(newQuery, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...pt, ...pa, ...pt, ...pa, ...params],
    });
  }
  async getSalesByASS(req: Request): Promise<salesByHirarki[]> {
    const { sort } = req.validated;
    let qTarget = queryTarget + " AND pic.ass_id = mp.kode_pic";
    let qAktual = queryAktual + " AND pic.ass_id = mp.kode_pic";

    let { query: qt, params: pt } = filterParams.target(req, qTarget);
    let { query: qa, params: pa } = filterParams.aktual(req, qAktual);

    let query = `SELECT mp.nama_pic as nama_pic, (${qt}) AS target, (${qa}) AS aktual, (TRUNCATE(((${qa})/(${qt})* 100), 2 )) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_pic as mp ON mp.kode_pic = dp.ass_id WHERE mp.kode_pic IS NOT NULL`;

    let { query: newQuery, params }: { query: string; params: string[] } =
      filterParams.query(req, query);

    newQuery += ` GROUP BY mp.kode_pic ORDER BY pencapaian ${sort} LIMIT 5`;

    return await db.query(newQuery, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...pt, ...pa, ...pt, ...pa, ...params],
    });
  }
  async getSalesByAchiev(req: Request) {
    const { month_id, quarter_id } = req.validated;
    let { query: qt, params: pt } = filterParams.target(
      req,
      queryTargetByOutlet
    );

    qt += " GROUP BY outlet_id";
    let query = `SELECT mst.target, o.outlet_id, SUM(trb.sales) AS sales, CASE WHEN ROUND((SUM(trb.sales) / mst.target) * 100, 5) < 25 OR trb.sales IS NULL THEN '0% - 25%' WHEN ROUND((SUM(trb.sales) / mst.target) * 100, 5) >= 25 AND ROUND((SUM(trb.sales) / mst.target) * 100, 5) < 50 THEN '25% - 50%' WHEN ROUND((SUM(trb.sales) / mst.target) * 100, 5) >= 50 AND ROUND((SUM(trb.sales) / mst.target) * 100, 5) < 75 THEN '50% - 75%' WHEN ROUND((SUM(trb.sales) / mst.target) * 100, 5) >= 75 AND ROUND((SUM(trb.sales) / mst.target) * 100, 5) < 95 THEN '75% - 95%' WHEN ROUND((SUM(trb.sales) / mst.target) * 100, 5) >= 95 AND ROUND((SUM(trb.sales) / mst.target) * 100, 5) < 100 THEN '95 - 100%' ELSE '>= 100%' END AS cluster, CASE WHEN ROUND((SUM(trb.sales) / mst.target) * 100, 5) < 25 OR trb.sales IS NULL THEN '1' WHEN ROUND((SUM(trb.sales) / mst.target) * 100, 5) >= 25 AND ROUND((SUM(trb.sales) / mst.target) * 100, 5) < 50 THEN '2' WHEN ROUND((SUM(trb.sales) / mst.target) * 100, 5) >= 50 AND ROUND((SUM(trb.sales) / mst.target) * 100, 5) < 75 THEN '2' WHEN ROUND((SUM(trb.sales) / mst.target) * 100, 5) >= 75 AND ROUND((SUM(trb.sales) / mst.target) * 100, 5) < 95 THEN '3' WHEN ROUND((SUM(trb.sales) / mst.target) * 100, 5) >= 95 AND ROUND((SUM(trb.sales) / mst.target) * 100, 5) < 100 THEN '4' ELSE '5' END AS cluster_id FROM mstr_outlet AS o LEFT JOIN trx_transaksi AS tr ON tr.no_id = o.outlet_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_pulau_alias AS r ON o. region_id = r.pulau_id_alias INNER JOIN ms_head_region AS hr ON r.head_region_id = hr.head_region_id LEFT JOIN trx_transaksi_barang AS trb ON trb.kd_transaksi = tr.kd_transaksi INNER JOIN (${qt}) AS mst ON mst.outlet_id = o.outlet_id WHERE o.outlet_id IS NOT NULL`;

    let { query: newQ, params: newP } = filterParams.query(req, query);
    if (month_id) {
      newQ += " AND MONTH(tr.tgl_transaksi) = ?";
      newP.push(month_id);
    }

    if (quarter_id) {
      newQ += " AND MONTH(tr.tgl_transaksi) IN(?)";
      newP.push(quarter_id);
    }
    newQ += " GROUP BY outlet_id";

    let newQuery = `SELECT cluster, SUM(target) AS target, SUM(sales) AS aktual, COUNT(outlet_id) AS outlet FROM (${newQ}) AS custom GROUP BY cluster ORDER BY cluster_id`;

    return await db.query(newQuery, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...pt, ...newP],
    });
  }
  async getSummaryPerQuarter(req: Request) {
    let { query: qt, params: pt } = filterParams.target(
      req,
      queryTargetByOutlet
    );
    let { query: qap, params: pap } = filterParams.aktual(
      req,
      queryAktualAndPoint
    );

    qap += " GROUP BY bulan";
    qt += " GROUP BY b.id";

    let query = `SELECT b.bulan, aktual, poin, SUM(target) AS target FROM mstr_outlet AS o LEFT JOIN(${qt}) AS mst ON mst.outlet_id = o.outlet_id LEFT JOIN(${qap}) AS trb ON trb.bulan = mst.bulan INNER JOIN ms_bulan AS b ON b.id = mst.bulan INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`;

    let { query: newQuery, params } = filterParams.query(req, query);
    newQuery += " GROUP BY b.id ORDER BY b.id ASC";

    return await db.query(newQuery, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...pt, ...pap, ...params],
    });
  }
  async getSummaryPerSemester(req: Request) {
    const { semester_id } = req.validated;
    let { query: qt, params: pt } = filterParams.target(
      req,
      queryTargetByOutlet
    );
    let { query: qap, params: pap } = filterParams.aktual(
      req,
      queryAktualAndPoint
    );

    qap += " GROUP BY bulan";
    qt += " GROUP BY b.id";

    let query = `SELECT CASE WHEN b.id = 1 OR b.id = 2 OR b.id = 3 THEN '1' WHEN b.id = 4 OR b.id = 5 OR b.id = 6 THEN '2' WHEN b.id = 7 OR b.id = 8 OR b.id = 9 THEN '3' WHEN b.id = 10 OR b.id = 11 OR b.id = 12 THEN '4' END AS kuartal, SUM(aktual) AS aktual, SUM(poin) AS poin, SUM(target) AS target FROM mstr_outlet AS o LEFT JOIN(${qt}) AS mst ON mst.outlet_id = o.outlet_id LEFT JOIN(${qap}) AS trb ON trb.bulan = mst.bulan INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_bulan AS b ON b.id = mst.bulan WHERE o.outlet_id IS NOT NULL`;

    if(semester_id){
      query += ` AND b.id IN (${semester_id})`
    }

    let { query: newQuery, params } = filterParams.query(req, query);
    newQuery += " GROUP BY kuartal";

    return await db.query(newQuery, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...pt, ...pap, ...params],
    });
  }
  async getSummaryPerYear(req: Request) {
    let { query: qt, params: pt } = filterParams.target(
      req,
      queryTargetByOutlet
    );
    let { query: qap, params: pap } = filterParams.aktual(
      req,
      queryAktualAndPoint
    );

    qap += " GROUP BY bulan";
    qt += " GROUP BY b.id";

    let query = `SELECT CASE WHEN b.id = 1 OR b.id = 2 OR b.id = 3 OR b.id = 4 OR b.id = 5 OR b.id = 6 THEN '1' WHEN b.id = 4 OR b.id = 5 OR b.id = 6 OR b.id = 7 OR b.id = 8 OR b.id = 9 or b.id = 10 OR b.id = 11 OR b.id = 12 THEN '2' END AS kuartal, SUM(aktual) AS aktual, SUM(poin) AS poin, SUM(target) AS target FROM mstr_outlet AS o LEFT JOIN(${qt}) AS mst ON mst.outlet_id = o.outlet_id LEFT JOIN(${qap}) AS trb ON trb.bulan = mst.bulan INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_bulan AS b ON b.id = mst.bulan WHERE o.outlet_id IS NOT NULL`;

    let { query: newQuery, params } = filterParams.query(req, query);
    newQuery += " GROUP BY kuartal";

    return await db.query(newQuery, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...pt, ...pap, ...params],
    });
  }
  async getSummaryPerYears(req: Request) {
    let { query: qt, params: pt } = filterParams.target(
      req,
      queryTargetByOutlet
    );
    let { query: qap, params: pap } = filterParams.aktual(
      req,
      queryAktualAndPoint
    );

    qap += " GROUP BY bulan";
    qt += " GROUP BY b.id";

    let query = `SELECT SUM(aktual) AS aktual, SUM(poin) AS poin, SUM(target) AS target FROM mstr_outlet AS o LEFT JOIN(${qt}) AS mst ON mst.outlet_id = o.outlet_id LEFT JOIN(${qap}) AS trb ON trb.bulan = mst.bulan INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_bulan AS b ON b.id = mst.bulan WHERE o.outlet_id IS NOT NULL`;

    let { query: newQuery, params } = filterParams.query(req, query);

    return await db.query(newQuery, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...pt, ...pap, ...params],
    });
  }
  async getSummary(req: Request) {
    let { query: qt, params: pt } = filterParams.target(req, queryTarget);
    let { query: qa, params: pa } = filterParams.aktual(req, queryAktual);
    let { query: qo, params: po } = filterParams.count(req, queryOutletCount);

    let query = `SELECT DISTINCT (${qa}) AS aktual, (${qt}) AS target, (${qo}) AS total_outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`;

    let { query: newQuery, params } = filterParams.query(req, query);

    return await db.query(newQuery, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...pt, ...pa, ...po, ...params],
    });
  }
  async getTargetByOutlet(req: Request) {
    let q =
      "SELECT SUM(mst.target_sales) AS target, mst.outlet_id, COUNT(DISTINCT mst.outlet_id) AS outlet FROM ( SELECT * FROM mstr_sales_target UNION SELECT * FROM mstr_sales_target2 UNION SELECT * FROM mstr_sales_target3 UNION SELECT * FROM mstr_sales_target4 ) AS mst INNER JOIN ms_bulan AS b ON b.bulan = mst.month_target INNER JOIN mstr_outlet as ou ON ou.outlet_id = mst.outlet_id INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_pulau_alias AS r ON ou. region_id = r.pulau_id_alias WHERE mst.outlet_id IS NOT NULL";

    let { query, params } = filterParams.target(req, q);

    return await db.query(query + " GROUP BY mst.outlet_id", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...params],
    });
  }
  async getAktualByOutlet(
    req: Request
  ): Promise<{ aktual: string; no_id: string }[]> {
    let q =
      "SELECT SUM(trb.sales) AS aktual, tr.no_id, COUNT(DISTINCT tr.no_id) AS outlet FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.kd_transaksi = trb.kd_transaksi INNER JOIN mstr_outlet AS ou ON ou.outlet_id = tr.no_id INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_pulau_alias AS r ON ou. region_id = r.pulau_id_alias WHERE tr.no_id IS NOT NULL";

    let { query, params } = filterParams.aktual(req, q);

    return await db.query(query + " GROUP BY tr.no_id", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...params],
    });
  }
}

export default new Sales();
