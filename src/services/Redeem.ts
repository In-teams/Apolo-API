import { Request } from "express";
import { QueryTypes } from "sequelize";
import db from "../config/db";
import ArrayOfObjToObj from "../helpers/ArrayOfObjToObj";
import DateFormat from "../helpers/DateFormat";
import FilterParams from "../helpers/FilterParams";

let getPointQuery =
  "SELECT CAST(SUM(trb.point_satuan) AS DECIMAL(20,2)) AS achieve FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.kd_transaksi = trb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id";

let getPointRedeemQuery =
  "SELECT CAST(SUM(trrb.point_satuan * trrb.quantity) AS DECIMAL(20,2)) AS redeem FROM trx_transaksi_redeem AS tr INNER JOIN trx_transaksi_redeem_barang AS trrb ON tr.kd_transaksi = trrb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id";

const getPointByHirarki = (col: string): string =>
  `SELECT ${col}, CAST(SUM(trb.point_satuan) AS DECIMAL(20,2)) AS achieve FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.kd_transaksi = trb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id`;
const getPointByMonth = (): string =>
  `SELECT CAST(SUM(trb.point_satuan) AS DECIMAL(20,2)) AS achieve, MONTH(tr.tgl_transaksi) AS bulan FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.kd_transaksi = trb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id GROUP BY bulan`;
const getPointRedeemByMonth = (): string =>
  `SELECT CAST(SUM(trrb.point_satuan * trrb.quantity) AS DECIMAL(20,2)) AS redeem, MONTH(tr.tgl_transaksi) AS bulan FROM trx_transaksi_redeem AS tr INNER JOIN trx_transaksi_redeem_barang AS trrb ON tr.kd_transaksi = trrb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id GROUP BY bulan`;
const getPointRedeemByHirarki = (col: string): string =>
  `SELECT ${col}, CAST(SUM(trrb.point_satuan * trrb.quantity) AS DECIMAL(20,2)) AS redeem FROM trx_transaksi_redeem AS tr INNER JOIN trx_transaksi_redeem_barang AS trrb ON tr.kd_transaksi = trrb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id`;

class Redeem {
  async validation(data: any, t: any): Promise<any> {
    try {
      const { status_penukaran, validated_at, file_id, outlet_id } = data;
      await db.query(
        "UPDATE trx_file_penukaran SET status_penukaran = ?, validated_at = ? WHERE id = ?",
        {
          raw: true,
          type: QueryTypes.UPDATE,
          transaction: t,
          replacements: [status_penukaran, validated_at, file_id],
        }
      );
      return await db.query(
        "INSERT INTO trx_history_penukaran (outlet_id, status_penukaran, file_id, created_at) VALUES(?, ?, ?, ?)",
        {
          raw: true,
          type: QueryTypes.INSERT,
          transaction: t,
          replacements: [outlet_id, status_penukaran, file_id, validated_at],
        }
      );
    } catch (error) {}
  }
  async postRedeemFile(req: Request, t: any): Promise<any> {
    try {
      const { outlet_id, filename, tgl_upload } = req.validated.file;
      const id = await db.query(
        "INSERT INTO trx_file_penukaran (outlet_id, filename, tgl_upload) VALUES(?, ?, ?)",
        {
          raw: true,
          type: QueryTypes.INSERT,
          replacements: [outlet_id, filename, tgl_upload],
          transaction: t,
        }
      );
      await db.query(
        "INSERT INTO trx_history_penukaran (outlet_id, status_penukaran, file_id, created_at) VALUES(?, ?, ?, ?)",
        {
          raw: true,
          type: QueryTypes.INSERT,
          replacements: [outlet_id, 2, id[0], tgl_upload],
          transaction: t,
        }
      );
      return await db.query(
        "INSERT INTO trx_history_file_penukaran (outlet_id, filename, tgl_upload) VALUES(?, ?, ?)",
        {
          raw: true,
          type: QueryTypes.INSERT,
          replacements: [outlet_id, filename, tgl_upload],
          transaction: t,
        }
      );
    } catch (error) {}
  }
  async updateRedeemFile(req: Request, t: any): Promise<any> {
    try {
      const { outlet_id, filename, tgl_upload } = req.validated.file;
      await db.query(
        "UPDATE trx_file_penukaran SET filename = ?, tgl_upload = ? WHERE outlet_id = ?",
        {
          raw: true,
          type: QueryTypes.UPDATE,
          replacements: [filename, tgl_upload, outlet_id],
          transaction: t,
        }
      );
      return await db.query(
        "INSERT INTO trx_history_file_penukaran (outlet_id, filename, tgl_upload) VALUES(?, ?, ?)",
        {
          raw: true,
          type: QueryTypes.INSERT,
          replacements: [outlet_id, filename, tgl_upload],
          transaction: t,
        }
      );
    } catch (error) {}
  }
  async getRedeemStatus(): Promise<any> {
    try {
      return await db.query("SELECT * FROM ms_status_penukaran", {
        raw: true,
        type: QueryTypes.SELECT,
      });
    } catch (error) {}
  }
  async getRedeemFile(req: Request): Promise<any> {
    try {
      const { outlet_id } = req.validated;
      const thisMonth = +DateFormat.getToday("MM");
      return await db.query(
        "SELECT * FROM trx_file_penukaran WHERE outlet_id = ? ORDER BY tgl_upload DESC",
        {
          raw: true,
          type: QueryTypes.SELECT,
          replacements: [outlet_id],
        }
      );
    } catch (error) {}
  }
  async getHistoryRedeemFile(req: Request): Promise<any> {
    try {
      const { file_id } = req.validated;
      const thisMonth = +DateFormat.getToday("MM");
      return await db.query(
        "SELECT hp.*, sp.status FROM trx_history_penukaran AS hp INNER JOIN ms_status_penukaran AS sp ON sp.id = hp.status_penukaran WHERE file_id = ?",
        {
          raw: true,
          type: QueryTypes.SELECT,
          replacements: [file_id],
        }
      );
    } catch (error) {}
  }
  async getRedeemFileById(req: Request): Promise<any> {
    try {
      const { file_id, outlet_id } = req.validated;
      const thisMonth = +DateFormat.getToday("MM");
      return await db.query("SELECT * FROM trx_file_penukaran WHERE id = ?", {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [file_id],
      });
    } catch (error) {}
  }
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
  async getRedeemLast(req: Request): Promise<any> {
    let q =
      "SELECT DISTINCT o.outlet_id, o.outlet_name, tgl_transaksi FROM trx_transaksi_redeem AS tr INNER JOIN mstr_outlet AS o ON o.outlet_id = tr.no_id INNER JOIN ms_pulau_alias AS reg ON reg.pulau_id_alias = o.region_id INNER JOIN ms_head_region AS mhr on mhr.head_region_id = reg.head_region_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL";
    let { query: pq, params: pp } = FilterParams.aktual(req, q);

    return await db.query(pq + " ORDER BY tgl_transaksi DESC LIMIT 5", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointPerMonth(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(req, getPointByMonth());

    const data = await db.query(pq, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });

    return ArrayOfObjToObj(data, "bulan", "achieve");
  }
  async getPointRedeemPerMonth(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointRedeemByMonth()
    );

    const data = await db.query(pq, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });

    return ArrayOfObjToObj(data, "bulan", "redeem");
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
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointByHirarki("r.head_region_id")
    );

    return await db.query(pq + " GROUP BY r.head_region_id", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointByRegion(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointByHirarki("r.pulau_id_alias")
    );

    return await db.query(pq + " GROUP BY r.pulau_id_alias", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointByArea(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointByHirarki("ou.city_id_alias")
    );

    return await db.query(pq + " GROUP BY ou.city_id_alias", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointByDistributor(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointByHirarki("ou.distributor_id")
    );

    return await db.query(pq + " GROUP BY ou.distributor_id", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointByOutlet(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointByHirarki("ou.outlet_id")
    );

    return await db.query(pq + " GROUP BY ou.outlet_id", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointByASM(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointByHirarki("pic.asm_id")
    );

    return await db.query(pq + " GROUP BY pic.asm_id", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointByASS(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointByHirarki("pic.ass_id")
    );

    return await db.query(pq + " GROUP BY pic.ass_id", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointRedeem(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointRedeemQuery
    );

    return await db.query(pq, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointRedeemByHR(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointRedeemByHirarki("r.head_region_id")
    );

    return await db.query(pq + " GROUP BY r.head_region_id", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointRedeemByRegion(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointRedeemByHirarki("r.pulau_id_alias")
    );

    return await db.query(pq + " GROUP BY r.pulau_id_alias", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointRedeemByArea(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointRedeemByHirarki("ou.city_id_alias")
    );

    return await db.query(pq + " GROUP BY ou.city_id_alias", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointRedeemByDistributor(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointRedeemByHirarki("ou.distributor_id")
    );

    return await db.query(pq + " GROUP BY ou.distributor_id", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointRedeemByOutlet(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointRedeemByHirarki("ou.outlet_id")
    );

    return await db.query(pq + " GROUP BY ou.outlet_id", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointRedeemByASM(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointRedeemByHirarki("pic.asm_id")
    );

    return await db.query(pq + " GROUP BY pic.asm_id", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointRedeemByASS(req: Request): Promise<any> {
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointRedeemByHirarki("pic.ass_id")
    );

    return await db.query(pq + " GROUP BY pic.ass_id", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getProduct(req: Request, point: number): Promise<any> {
    const { category } = req.validated;
    let q =
      "SELECT mp.product_id, mp.product_name, mpb.point, category FROM ms_product AS mp INNER JOIN ms_program_barang AS mpb ON mp.product_id =  mpb.product_id WHERE point <= ?";
    let params = [point];
    if (category) {
      q += " AND category = ?";
      params.push(category);
    }
    return await db.query(q, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...params],
    });
  }
  async getProductCategory(req: Request, point: number): Promise<any> {
    return await db.query(
      "SELECT DISTINCT category FROM ms_product AS mp INNER JOIN ms_program_barang AS mpb ON mp.product_id =  mpb.product_id WHERE point <= ?",
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [point],
      }
    );
  }
  async getLastTrRedeemCode(): Promise<any> {
    const data: any = await db.query(
      "SELECT MAX(kd_transaksi) AS trCode FROM trx_transaksi_redeem",
      {
        raw: true,
        type: QueryTypes.SELECT,
      }
    );

    return data[0]?.trCode || "MV2021-1-00000001";
  }
  async insert(data: any[], detail: any[], t: any): Promise<any> {
    const dataVal = data.map((e: any) => Object.values(e));
    const dataDetail = detail.map((e: any) => Object.values(e));

    await db.query("INSERT INTO trx_transaksi_redeem VALUES ?", {
      raw: true,
      type: QueryTypes.INSERT,
      transaction: t,
      replacements: [dataVal],
    });

    return await db.query(
      "INSERT INTO trx_transaksi_redeem_barang (kd_transaksi, kd_produk, nama_produk, quantity, point_satuan) VALUES ?",
      {
        raw: true,
        type: QueryTypes.INSERT,
        transaction: t,
        replacements: [dataDetail],
      }
    );
  }
}

export default new Redeem();
