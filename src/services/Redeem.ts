import { Request } from "express";
import { QueryTypes } from "sequelize";
import db from "../config/db";
import DateFormat from "../helpers/DateFormat";
import FilterParams from "../helpers/FilterParams";

let getPointQuery =
  "SELECT CAST(SUM(trb.point_satuan) AS DECIMAL(20,2)) AS achieve FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.kd_transaksi = trb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id";

let getPointRedeemQuery =
  "SELECT CAST(SUM(trrb.point_satuan * trrb.quantity) AS DECIMAL(20,2)) AS redeem FROM trx_transaksi_redeem AS tr INNER JOIN trx_transaksi_redeem_barang AS trrb ON tr.kd_transaksi = trrb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id";

class Redeem {
  async getPointSummary(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(req, getPointQuery);
    let { query: prq, params: prp } = FilterParams.aktual(
      req,
      getPointRedeemQuery
    );

    let q = `SELECT DISTINCT (${pq}) AS achieve, (${prq}) AS redeem FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`;

    let { query, params } = FilterParams.query(req, q);

    return await db.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...pp, ...prp, ...params],
    });
  }
  async getPoint(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(req, getPointQuery);

    return await db.query(pq, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointByHR(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(req, "SELECT r.head_region_id, CAST(SUM(trb.point_satuan) AS DECIMAL(20,2)) AS achieve FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.kd_transaksi = trb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id");

    return await db.query(pq + " GROUP BY r.head_region_id", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointByRegion(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(req, "SELECT r.pulau_id_alias, CAST(SUM(trb.point_satuan) AS DECIMAL(20,2)) AS achieve FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.kd_transaksi = trb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id");

    return await db.query(pq + " GROUP BY r.pulau_id_alias", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointRedeem(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(req, getPointRedeemQuery);

    return await db.query(pq, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointRedeemByHR(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(req, "SELECT r.head_region_id, CAST(SUM(trrb.point_satuan * trrb.quantity) AS DECIMAL(20,2)) AS redeem FROM trx_transaksi_redeem AS tr INNER JOIN trx_transaksi_redeem_barang AS trrb ON tr.kd_transaksi = trrb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id");

    return await db.query(pq + " GROUP BY r.head_region_id", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointRedeemByRegion(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(req, "SELECT r.pulau_id_alias, CAST(SUM(trrb.point_satuan * trrb.quantity) AS DECIMAL(20,2)) AS redeem FROM trx_transaksi_redeem AS tr INNER JOIN trx_transaksi_redeem_barang AS trrb ON tr.kd_transaksi = trrb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id");

    return await db.query(pq + " GROUP BY r.pulau_id_alias", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
}

export default new Redeem();
