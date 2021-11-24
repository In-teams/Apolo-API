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
  `SELECT ${col}, CAST(SUM(trb.point_satuan) AS DECIMAL(20,2)) AS achieve FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.kd_transaksi = trb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN mstr_distributor AS d ON d.distributor_id = ou.distributor_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_pic AS p ON p.kode_pic = pic.asm_id INNER JOIN ms_pic AS ass ON ass.kode_pic = pic.ass_id INNER JOIN ms_head_region AS hr ON hr.head_region_id = r.head_region_id INNER JOIN ms_city_alias AS c ON c.city_id_alias = ou.city_id_alias`;
const getPointByMonth = (): string =>
  `SELECT CAST(SUM(trb.point_satuan) AS DECIMAL(20,2)) AS achieve, MONTH(tr.tgl_transaksi) AS bulan FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.kd_transaksi = trb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id GROUP BY bulan`;
const getPointRedeemByMonth = (): string =>
  `SELECT CAST(SUM(trrb.point_satuan * trrb.quantity) AS DECIMAL(20,2)) AS redeem, MONTH(tr.tgl_transaksi) AS bulan FROM trx_transaksi_redeem AS tr INNER JOIN trx_transaksi_redeem_barang AS trrb ON tr.kd_transaksi = trrb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id GROUP BY bulan`;
const getPointRedeemByHirarki = (col: string): string =>
  `SELECT ${col}, CAST(SUM(trrb.point_satuan * trrb.quantity) AS DECIMAL(20,2)) AS redeem FROM trx_transaksi_redeem AS tr INNER JOIN trx_transaksi_redeem_barang AS trrb ON tr.kd_transaksi = trrb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN mstr_distributor AS d ON d.distributor_id = ou.distributor_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_pic AS p ON p.kode_pic = pic.asm_id INNER JOIN ms_pic AS ass ON ass.kode_pic = pic.ass_id INNER JOIN ms_head_region AS hr ON hr.head_region_id = r.head_region_id INNER JOIN ms_city_alias AS c ON c.city_id_alias = ou.city_id_alias`;

class Redeem {
  async validation(data: any, t: any): Promise<any> {
    try {
      const { status_penukaran, validated_at, file_id, outlet_id, user_id } =
        data;
      await db.query(
        "UPDATE trx_file_penukaran SET status_penukaran = ?, validated_at = ?, validated_by = ? WHERE id = ?",
        {
          raw: true,
          type: QueryTypes.UPDATE,
          transaction: t,
          replacements: [status_penukaran, validated_at, user_id, file_id],
        }
      );
      return await db.query(
        "INSERT INTO trx_history_penukaran (outlet_id, status_penukaran, file_id, created_at, validated_by) VALUES(?, ?, ?, ?, ?)",
        {
          raw: true,
          type: QueryTypes.INSERT,
          transaction: t,
          replacements: [
            outlet_id,
            status_penukaran,
            file_id,
            validated_at,
            user_id,
          ],
        }
      );
    } catch (error) {}
  }
  async deleteRedeemFileByIds(ids: number[], t: any): Promise<any> {
    try {
      return await db.query(
        "DELETE FROM trx_file_penukaran WHERE outlet_id IN (?) AND MONTH(tgl_upload) = ?",
        {
          raw: true,
          type: QueryTypes.DELETE,
          replacements: [ids, new Date().getMonth() + 1],
          transaction: t,
        }
      );
    } catch (error) {
      console.log(error, "errororr")
    }
  }
  async postRedeemFileBulky(data: any, t: any): Promise<any> {
    try {
      let id: any = await db.query(
        "INSERT INTO trx_file_penukaran (outlet_id, filename, tgl_upload, uploaded_by) VALUES ?",
        {
          raw: true,
          type: QueryTypes.INSERT,
          replacements: [data],
          transaction: t,
        }
      );
      let count = id.pop();
      id = id.shift();
      const ids = [id];
      for (let i = 1; i < count; i++) {
        ids.push(id + i);
      }

      let histories = [];
      for (let i = 0; i < data.length; i++) {
        histories.push([data[i][0], ids[i], data[i][2]]);
      }
      await db.query(
        "INSERT INTO trx_history_penukaran (outlet_id, file_id, created_at) VALUES ?",
        {
          raw: true,
          type: QueryTypes.INSERT,
          replacements: [histories],
          transaction: t,
        }
      );
      return await db.query(
        "INSERT INTO trx_history_file_penukaran (outlet_id, filename, tgl_upload, uploaded_by) VALUES ?",
        {
          raw: true,
          type: QueryTypes.INSERT,
          replacements: [data],
          transaction: t,
        }
      );
    } catch (error) {
      console.log(error, "errorrrrr")
    }
  }
  async postRedeemFile(data: any, t: any): Promise<any> {
    try {
      const { outlet_id, filename, tgl_upload, user_id } = data;
      const id = await db.query(
        "INSERT INTO trx_file_penukaran (outlet_id, filename, tgl_upload, uploaded_by) VALUES(?, ?, ?, ?)",
        {
          raw: true,
          type: QueryTypes.INSERT,
          replacements: [outlet_id, filename, tgl_upload, user_id],
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
        "INSERT INTO trx_history_file_penukaran (outlet_id, filename, tgl_upload, uploaded_by) VALUES(?, ?, ?, ?)",
        {
          raw: true,
          type: QueryTypes.INSERT,
          replacements: [outlet_id, filename, tgl_upload, user_id],
          transaction: t,
        }
      );
    } catch (error) {}
  }
  async updateRedeemFile(data: any, t: any): Promise<any> {
    try {
      const { outlet_id, filename, tgl_upload, user_id } = data;
      await db.query(
        "UPDATE trx_file_penukaran SET filename = ?, tgl_upload = ?, uploaded_by = ? WHERE outlet_id = ?",
        {
          raw: true,
          type: QueryTypes.UPDATE,
          replacements: [filename, tgl_upload, user_id, outlet_id],
          transaction: t,
        }
      );
      return await db.query(
        "INSERT INTO trx_history_file_penukaran (outlet_id, filename, tgl_upload, uploaded_by) VALUES(?, ?, ?, ?)",
        {
          raw: true,
          type: QueryTypes.INSERT,
          replacements: [outlet_id, filename, tgl_upload, user_id],
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
        "SELECT f.*, f.filename AS file, sp.status FROM trx_file_penukaran AS f INNER JOIN ms_status_penukaran AS sp ON sp.id = f.status_penukaran WHERE outlet_id = ? AND MONTH(tgl_upload) = ? ORDER BY tgl_upload DESC",
        {
          raw: true,
          type: QueryTypes.SELECT,
          replacements: [outlet_id, thisMonth],
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
  async getRedeemFileByFileId(data: any): Promise<any> {
    try {
      const { file_id } = data;
      const thisMonth = new Date().getMonth() + 1;
      const findOne = await db.query(
        "SELECT fp.*, sp.level FROM trx_file_penukaran AS fp INNER JOIN ms_status_penukaran AS sp ON fp.`status_penukaran` = sp.`id` WHERE fp.id = ?",
        {
          raw: true,
          type: QueryTypes.SELECT,
          replacements: [file_id],
        }
      );
      return findOne ? findOne[0] : null;
    } catch (error) {}
  }
  async getRedeemFileById(req: Request): Promise<any> {
    try {
      const { file_id, outlet_id } = req.validated;
      const thisMonth = new Date().getMonth() + 1;
      const findOne = await db.query(
        "SELECT fp.*, sp.level FROM trx_file_penukaran AS fp INNER JOIN ms_status_penukaran AS sp ON fp.`status_penukaran` = sp.`id` WHERE fp.id = ? AND outlet_id = ? AND MONTH(tgl_upload) = ? LIMIT 1",
        {
          raw: true,
          type: QueryTypes.SELECT,
          replacements: [file_id, outlet_id, thisMonth],
        }
      );
      return findOne ? findOne[0] : null;
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
  async getPointByHirarki(req: Request, type?: string): Promise<any> {
    let select = "";
    let groupBy = "";
    if (type === "outlet") {
      select = "ou.outlet_id, ou.outlet_name";
      groupBy = "ou.outlet_id";
    } else if (type === "hr") {
      select = "hr.head_region_id, hr.head_region_name";
      groupBy = "hr.head_region_id";
    } else if (type === "region") {
      select = "r.pulau_id_alias AS region_id, r.nama_pulau_alias AS region";
      groupBy = "r.pulau_id_alias";
    } else if (type === "distributor") {
      select = "d.distributor_id, d.distributor_name AS distributor";
      groupBy = "d.distributor_id";
    } else if (type === "area") {
      select = "c.city_id_alias AS area_id, c.city_name_alias AS city";
      groupBy = "c.city_id_alias";
    } else if (type === "asm") {
      select = "p.kode_pic AS asm_id, p.nama_pic";
      groupBy = "asm_id";
    } else if (type === "ass") {
      select = "ass.kode_pic AS ass_id, ass.nama_pic";
      groupBy = "ass_id";
    }
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointByHirarki(select)
    );

    return await db.query(pq + ` GROUP BY ${groupBy}`, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: pp,
    });
  }
  async getPointRedeemByHirarki(req: Request, type?: string): Promise<any> {
    let select = "";
    let groupBy = "";
    if (type === "outlet") {
      select = "ou.outlet_id, ou.outlet_name";
      groupBy = "ou.outlet_id";
    } else if (type === "hr") {
      select = "hr.head_region_id, hr.head_region_name";
      groupBy = "hr.head_region_id";
    } else if (type === "region") {
      select = "r.pulau_id_alias AS region_id, r.nama_pulau_alias AS region";
      groupBy = "r.pulau_id_alias";
    } else if (type === "distributor") {
      select = "d.distributor_id, d.distributor_name AS distributor";
      groupBy = "d.distributor_id";
    } else if (type === "area") {
      select = "c.city_id_alias AS area_id, c.city_name_alias AS city";
      groupBy = "c.city_id_alias";
    } else if (type === "asm") {
      select = "p.kode_pic AS asm_id, p.nama_pic";
      groupBy = "asm_id";
    } else if (type === "ass") {
      select = "ass.kode_pic AS ass_id, ass.nama_pic";
      groupBy = "ass_id";
    }
    let { query: pq, params: pp } = FilterParams.aktual(
      req,
      getPointRedeemByHirarki(select)
    );

    return await db.query(pq + ` GROUP BY ${groupBy}`, {
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
  async getProduct(data: any, point: number): Promise<any> {
    const { category } = data;
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
      "SELECT DISTINCT mpc.* FROM ms_product AS mp INNER JOIN ms_program_barang AS mpb ON mp.product_id =  mpb.product_id INNER JOIN ms_product_category AS mpc ON mp.category = mpc.kd_category WHERE point <= ?",
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [point],
      }
    );
  }
  async getProductCategoryByProduct(products: string | string[]): Promise<any> {
    const find: any = await db.query(
      "SELECT category FROM ms_product WHERE product_id IN(?)",
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [products],
      }
    );

    return find ? find.map((e: any) => e.category) : null;
  }
  async getRedeemHistory(data: any): Promise<any> {
    const { file_id, category } = data;
    const params = [file_id];
    let query =
      "SELECT created_by, tgl_confirm, tgl_confirm, tr.kd_transaksi, tgl_transaksi, kd_produk, nama_produk, quantity, point_satuan, p.category FROM trx_transaksi_redeem AS tr INNER JOIN trx_transaksi_redeem_barang AS trb ON tr.`kd_transaksi` = trb.`kd_transaksi` INNER JOIN ms_product p ON p.product_id = trb.kd_produk LEFT JOIN trx_status s ON tr.`kd_transaksi` = s.`kd_transaksi` LEFT JOIN trx_pr_barang i ON i.kd_transaksi = tr.`kd_transaksi` LEFT JOIN trx_pr j ON j.kode_pr = i.kode_pr LEFT JOIN trx_confirm_detail k ON k.kd_transaksi = tr.kd_transaksi LEFT JOIN trx_confirm l ON l.id_confirm = k.id_confirm LEFT JOIN trx_valid_redeemp n ON n.kd_transaksi = tr.kd_transaksi WHERE file_id = ?";
    if (category) {
      query += " AND p.category = ?";
      params.push(category);
    }
    return await db.query(query + " ORDER BY tgl_transaksi DESC", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: params,
    });
  }
  async getRedeemHistoryDetail(
    kd_transaksi: string,
    file_id: string
  ): Promise<any> {
    const find: any[] = await db.query(
      "SELECT tp.no_handphone, tgl_transaksi,kd_produk,nama_produk,quantity,tgl_confirm,`tanggal_terima`,`nama_penerima`,tr.kd_transaksi,point_satuan, tgl_confirm, o.*  FROM trx_transaksi_redeem tr INNER JOIN trx_transaksi_redeem_barang trb ON tr.`kd_transaksi` = trb.`kd_transaksi` LEFT JOIN trx_status s ON trb.`kd_transaksi` = s.`kd_transaksi`  LEFT JOIN trx_pr_barang i ON i.kd_transaksi = trb.`kd_transaksi` LEFT JOIN trx_pr j ON j.kode_pr = i.kode_pr LEFT JOIN trx_confirm_detail k ON k.kd_transaksi = trb.kd_transaksi LEFT JOIN trx_confirm l ON l.id_confirm = k.id_confirm LEFT JOIN trx_valid_redeemp n ON n.kd_transaksi = trb.kd_transaksi INNER JOIN mstr_outlet o ON o.outlet_id = tr.no_id LEFT JOIN trx_transaksi_pulsa tp ON tp.kd_transaksi = tr.kd_transaksi WHERE trb.kd_transaksi = ? AND file_id = ?",
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [kd_transaksi, file_id],
      }
    );

    return find ? find[0] : null;
  }
  async getTransactionCode(kd_transaksi: string): Promise<any> {
    const find: any = await db.query(
      "SELECT kd_transaksi FROM trx_transaksi_redeem WHERE kd_transaksi = ?",
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [kd_transaksi],
      }
    );

    return find ? find[0] : null;
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
  async insert(
    data: any[],
    detail: any[],
    pulsaEwallet: any[],
    t: any
  ): Promise<any> {
    const dataVal = data.map((e: any) => Object.values(e));
    const dataDetail = detail.map((e: any) => Object.values(e));

    await db.query("INSERT INTO trx_transaksi_redeem VALUES ?", {
      raw: true,
      type: QueryTypes.INSERT,
      transaction: t,
      replacements: [dataVal],
    });

    if (pulsaEwallet.length > 0) {
      const dataPulsaEwallet = pulsaEwallet.map((e: any) => Object.values(e));
      await db.query(
        "INSERT INTO trx_transaksi_pulsa (kd_transaksi, no_handphone) VALUES ?",
        {
          raw: true,
          type: QueryTypes.INSERT,
          transaction: t,
          replacements: [dataPulsaEwallet],
        }
      );
    }

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
