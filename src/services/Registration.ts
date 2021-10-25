import { Request } from "express";
import { QueryTypes } from "sequelize";
import db from "../config/db";
import FilterParams from "../helpers/FilterParams";

let queryOutletCount =
  "SELECT COUNT(DISTINCT ou.outlet_id) AS total FROM mstr_outlet AS ou INNER JOIN ms_pulau_alias AS r ON ou.`region_id` = r. `pulau_id_alias` INNER JOIN ms_dist_pic AS pic ON ou.`distributor_id` = pic.`distributor_id` WHERE ou.`outlet_id` IS NOT NULL";

const getLevelQuery = async () => {
  const status = await db.query(
    "SELECT DISTINCT level FROM ms_status_registrasi WHERE id != 1",
    {
      raw: true,
      type: QueryTypes.SELECT,
    }
  );

  let q = "";
  status.map((e: any, i: number) => {
    q += `COUNT(CASE WHEN level = '${e.level}' THEN 10 END) AS '${e.level
      .split(" ")
      .join("")}'`;
    if (i + 1 !== status.length) return (q += ", ");
  });
  let level = status.map((e: any) => e.level.split(" ").join(""));
  let levelQ = "";
  level.map((e: any, i: number) => {
    levelQ += `IFNULL(${e}, 0) AS ${e}, `;
  });

  return { q, levelQ };
};

class Registration {
  async getRegistrationSummary(req: Request): Promise<any> {
    let q =
      "SELECT COUNT(*) AS regist FROM mstr_outlet AS o INNER JOIN trx_file_registrasi AS rf ON rf.outlet_id = o.outlet_id AND rf.type_file = 0 INNER JOIN ms_pulau_alias AS reg ON reg.pulau_id_alias = o.region_id INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN mstr_distributor AS d ON o.distributor_id = d.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL";

    let { query, params } = FilterParams.register(req, q);
    return await db.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...params],
    });
  }
  async getRegistrationSummaryByHR(req: Request): Promise<any> {
    const { q, levelQ } = await getLevelQuery();

    const { sort } = req.validated;
    let { query: qocs, params: pocs } = FilterParams.count(
      req,
      queryOutletCount
    );
    let { query: qr, params: pr } = FilterParams.register(
      req,
      `SELECT mhr.head_region_id AS wilayah, COUNT(*) AS regist, ${q} FROM mstr_outlet AS o INNER JOIN trx_file_registrasi AS rf ON rf.outlet_id = o.outlet_id AND rf.type_file = 0 INNER JOIN ms_status_registrasi AS sr ON sr.id = rf.status_registrasi INNER JOIN ms_pulau_alias AS reg ON reg.pulau_id_alias = o.region_id INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN mstr_distributor AS d ON o.distributor_id = d.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`
    );

    qr += " GROUP BY mhr.head_region_id";

    let { query, params } = FilterParams.query(
      req,
      `SELECT mhr.head_region_name AS wilayah, ${levelQ} IFNULL(regist, 0) AS regist, IFNULL((COUNT(o.outlet_id) - IFNULL(regist, 0)), 0) AS notregist, COUNT(o.outlet_id) AS total, (${qocs}) AS totals, CONCAT(TRUNCATE((COUNT(o.outlet_id)/(${qocs}) * 100), 2), '%') AS bobot_outlet, TRUNCATE((IFNULL(regist, 0)/(COUNT(o.outlet_id)) * 100), 2) AS pencapaian FROM ms_head_region AS mhr LEFT JOIN (${qr}) AS sub ON sub.wilayah = mhr.head_region_id INNER JOIN ms_pulau_alias AS reg ON reg.head_region_id = mhr.head_region_id INNER JOIN mstr_outlet AS o ON o.region_id = reg.pulau_id_alias INNER JOIN mstr_distributor AS d ON o.distributor_id = d.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`
    );
    return await db.query(
      query + ` GROUP BY head_region_name ORDER BY pencapaian ${sort}`,
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [...pr, ...pocs, ...pocs, ...params],
      }
    );
  }
  async getRegistrationSummaryByRegion(req: Request): Promise<any> {
    const { q, levelQ } = await getLevelQuery();

    const { sort } = req.validated;
    let { query: qocs, params: pocs } = FilterParams.count(
      req,
      queryOutletCount
    );
    let { query: qr, params: pr } = FilterParams.register(
      req,
      `SELECT reg.pulau_id_alias AS region_id, COUNT(*) AS regist, ${q} FROM mstr_outlet AS o INNER JOIN trx_file_registrasi AS rf ON rf.outlet_id = o.outlet_id AND rf.type_file = 0 INNER JOIN ms_status_registrasi AS sr ON sr.id = rf.status_registrasi INNER JOIN ms_pulau_alias AS reg ON reg.pulau_id_alias = o.region_id INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN mstr_distributor AS d ON o.distributor_id = d.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`
    );

    qr += " GROUP BY reg.pulau_id_alias";

    let { query, params } = FilterParams.query(
      req,
      `SELECT reg.nama_pulau_alias AS region, ${levelQ} IFNULL(regist, 0) AS regist, IFNULL((COUNT(o.outlet_id) - IFNULL(regist, 0)), 0) AS notregist, COUNT(o.outlet_id) AS total, (${qocs}) AS totals, CONCAT(TRUNCATE((COUNT(o.outlet_id)/(${qocs}) * 100), 2), '%') AS bobot_outlet, TRUNCATE((IFNULL(regist, 0)/(COUNT(o.outlet_id)) * 100), 2) AS pencapaian FROM ms_head_region AS mhr INNER JOIN ms_pulau_alias AS reg ON reg.head_region_id = mhr.head_region_id LEFT JOIN (${qr}) AS sub ON sub.region_id = reg.pulau_id_alias INNER JOIN mstr_outlet AS o ON o.region_id = reg.pulau_id_alias INNER JOIN mstr_distributor AS d ON o.distributor_id = d.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`
    );
    return await db.query(
      query + ` GROUP BY region ORDER BY pencapaian ${sort} LIMIT 5`,
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [...pr, ...pocs, ...pocs, ...params],
      }
    );
  }
  async getRegistrationSummaryByArea(req: Request): Promise<any> {
    const { q, levelQ } = await getLevelQuery();

    const { sort } = req.validated;
    let { query: qocs, params: pocs } = FilterParams.count(
      req,
      queryOutletCount
    );
    let { query: qr, params: pr } = FilterParams.register(
      req,
      `SELECT o.city_id_alias as area_id, COUNT(*) AS regist, ${q} FROM mstr_outlet AS o INNER JOIN trx_file_registrasi AS rf ON rf.outlet_id = o.outlet_id AND rf.type_file = 0 INNER JOIN ms_status_registrasi AS sr ON sr.id = rf.status_registrasi INNER JOIN ms_pulau_alias AS reg ON reg.pulau_id_alias = o.region_id INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN mstr_distributor AS d ON o.distributor_id = d.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`
    );

    qr += " GROUP BY city_id_alias";

    let { query, params } = FilterParams.query(
      req,
      `SELECT c.city_name_alias AS area, ${levelQ} IFNULL(regist, 0) AS regist, IFNULL((COUNT(o.outlet_id) - IFNULL(regist, 0)), 0) AS notregist, COUNT(o.outlet_id) AS total, (${qocs}) AS totals, CONCAT(TRUNCATE((COUNT(o.outlet_id)/(${qocs}) * 100), 2), '%') AS bobot_outlet, TRUNCATE((IFNULL(regist, 0)/(COUNT(o.outlet_id)) * 100), 2) AS pencapaian FROM ms_head_region AS mhr INNER JOIN ms_pulau_alias AS reg ON reg.head_region_id = mhr.head_region_id INNER JOIN mstr_outlet AS o ON o.region_id = reg.pulau_id_alias INNER JOIN ms_city_alias AS c on c.city_id_alias = o.city_id_alias LEFT JOIN (${qr}) AS sub ON sub.area_id = c.city_id_alias INNER JOIN mstr_distributor AS d ON o.distributor_id = d.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`
    );
    return await db.query(
      query + ` GROUP BY area ORDER BY pencapaian ${sort} LIMIT 5`,
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [...pr, ...pocs, ...pocs, ...params],
      }
    );
  }
  async getRegistrationSummaryByDistributor(req: Request): Promise<any> {
    const { q, levelQ } = await getLevelQuery();
    const { sort } = req.validated;
    let { query: qocs, params: pocs } = FilterParams.count(
      req,
      queryOutletCount
    );
    let { query: qr, params: pr } = FilterParams.register(
      req,
      `SELECT o.distributor_id as distributor_id, COUNT(*) AS regist, ${q} FROM mstr_outlet AS o INNER JOIN trx_file_registrasi AS rf ON rf.outlet_id = o.outlet_id AND rf.type_file = 0 INNER JOIN ms_status_registrasi AS sr ON sr.id = rf.status_registrasi INNER JOIN ms_pulau_alias AS reg ON reg.pulau_id_alias = o.region_id INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN mstr_distributor AS d ON o.distributor_id = d.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`
    );

    qr += " GROUP BY distributor_id";

    let { query, params } = FilterParams.query(
      req,
      `SELECT d.distributor_name AS distributor, ${levelQ} IFNULL(regist, 0) AS regist, IFNULL((COUNT(o.outlet_id) - IFNULL(regist, 0)), 0) AS notregist, COUNT(o.outlet_id) AS total, (${qocs}) AS totals, CONCAT(TRUNCATE((COUNT(o.outlet_id)/(${qocs}) * 100), 2), '%') AS bobot_outlet, TRUNCATE((IFNULL(regist, 0)/(COUNT(o.outlet_id)) * 100), 2) AS pencapaian FROM ms_head_region AS mhr INNER JOIN ms_pulau_alias AS reg ON reg.head_region_id = mhr.head_region_id INNER JOIN mstr_outlet AS o ON o.region_id = reg.pulau_id_alias INNER JOIN mstr_distributor AS d ON o.distributor_id = d.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id LEFT JOIN (${qr}) AS sub ON sub.distributor_id = d.distributor_id WHERE o.outlet_id IS NOT NULL`
    );
    return await db.query(
      query + ` GROUP BY distributor ORDER BY pencapaian ${sort} LIMIT 5`,
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [...pr, ...pocs, ...pocs, ...params],
      }
    );
  }
  async getRegistrationSummaryByOutlet(req: Request): Promise<any> {
    const { q, levelQ } = await getLevelQuery();
    const { sort } = req.validated;
    let { query: qocs, params: pocs } = FilterParams.count(
      req,
      queryOutletCount
    );
    let { query: qr, params: pr } = FilterParams.register(
      req,
      `SELECT o.outlet_id as outlet_id, COUNT(*) AS regist, ${q} FROM mstr_outlet AS o INNER JOIN trx_file_registrasi AS rf ON rf.outlet_id = o.outlet_id AND rf.type_file = 0 INNER JOIN ms_status_registrasi AS sr ON sr.id = rf.status_registrasi INNER JOIN ms_pulau_alias AS reg ON reg.pulau_id_alias = o.region_id INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN mstr_distributor AS d ON o.distributor_id = d.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`
    );

    qr += " GROUP BY outlet_id";

    let { query, params } = FilterParams.query(
      req,
      `SELECT o.outlet_name AS outlet, ${levelQ} IFNULL(regist, 0) AS regist, IFNULL((COUNT(o.outlet_id) - IFNULL(regist, 0)), 0) AS notregist, COUNT(o.outlet_id) AS total, (${qocs}) AS totals, CONCAT(TRUNCATE((COUNT(o.outlet_id)/(${qocs}) * 100), 2), '%') AS bobot_outlet, TRUNCATE((IFNULL(regist, 0)/(COUNT(o.outlet_id)) * 100), 2) AS pencapaian FROM ms_head_region AS mhr INNER JOIN ms_pulau_alias AS reg ON reg.head_region_id = mhr.head_region_id INNER JOIN mstr_outlet AS o ON o.region_id = reg.pulau_id_alias INNER JOIN mstr_distributor AS d ON o.distributor_id = d.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id LEFT JOIN (${qr}) AS sub ON sub.outlet_id = o.outlet_id WHERE o.outlet_id IS NOT NULL`
    );
    return await db.query(
      query + ` GROUP BY outlet ORDER BY pencapaian ${sort} LIMIT 5`,
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [...pr, ...pocs, ...pocs, ...params],
      }
    );
  }
  async getRegistrationSummaryByASM(req: Request): Promise<any> {
    const { q, levelQ } = await getLevelQuery();
    const { sort } = req.validated;
    let { query: qocs, params: pocs } = FilterParams.count(
      req,
      queryOutletCount
    );
    let { query: qr, params: pr } = FilterParams.register(
      req,
      `SELECT pic.kode_pic as asm_id, COUNT(*) AS regist, ${q} FROM mstr_outlet AS o INNER JOIN trx_file_registrasi AS rf ON rf.outlet_id = o.outlet_id AND rf.type_file = 0 INNER JOIN ms_status_registrasi AS sr ON sr.id = rf.status_registrasi INNER JOIN ms_pulau_alias AS reg ON reg.pulau_id_alias = o.region_id INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN mstr_distributor AS d ON o.distributor_id = d.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_pic AS pic ON pic.kode_pic = dp.asm_id WHERE o.outlet_id IS NOT NULL`
    );

    qr += " GROUP BY asm_id";

    let { query, params } = FilterParams.query(
      req,
      `SELECT pic.nama_pic AS nama_pic, ${levelQ} IFNULL(regist, 0) AS regist, IFNULL((COUNT(o.outlet_id) - IFNULL(regist, 0)), 0) AS notregist, COUNT(o.outlet_id) AS total, (${qocs}) AS totals, CONCAT(TRUNCATE((COUNT(o.outlet_id)/(${qocs}) * 100), 2), '%') AS bobot_outlet, TRUNCATE((IFNULL(regist, 0)/(COUNT(o.outlet_id)) * 100), 2) AS pencapaian FROM ms_head_region AS mhr INNER JOIN ms_pulau_alias AS reg ON reg.head_region_id = mhr.head_region_id INNER JOIN mstr_outlet AS o ON o.region_id = reg.pulau_id_alias INNER JOIN mstr_distributor AS d ON o.distributor_id = d.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_pic AS pic ON pic.kode_pic = dp.asm_id LEFT JOIN (${qr}) AS sub ON sub.asm_id = pic.kode_pic WHERE o.outlet_id IS NOT NULL`
    );
    return await db.query(
      query + ` GROUP BY nama_pic ORDER BY pencapaian ${sort} LIMIT 5`,
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [...pr, ...pocs, ...pocs, ...params],
      }
    );
  }
  async getRegistrationSummaryByASS(req: Request): Promise<any> {
    const { q, levelQ } = await getLevelQuery();
    const { sort } = req.validated;
    let { query: qocs, params: pocs } = FilterParams.count(
      req,
      queryOutletCount
    );
    let { query: qr, params: pr } = FilterParams.register(
      req,
      `SELECT pic.kode_pic as ass_id, COUNT(*) AS regist, ${q} FROM mstr_outlet AS o INNER JOIN trx_file_registrasi AS rf ON rf.outlet_id = o.outlet_id AND rf.type_file = 0 INNER JOIN ms_status_registrasi AS sr ON sr.id = rf.status_registrasi INNER JOIN ms_pulau_alias AS reg ON reg.pulau_id_alias = o.region_id INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN mstr_distributor AS d ON o.distributor_id = d.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_pic AS pic ON pic.kode_pic = dp.ass_id WHERE o.outlet_id IS NOT NULL`
    );

    qr += " GROUP BY ass_id";

    let { query, params } = FilterParams.query(
      req,
      `SELECT pic.nama_pic AS nama_pic, ${levelQ} IFNULL(regist, 0) AS regist, IFNULL((COUNT(o.outlet_id) - IFNULL(regist, 0)), 0) AS notregist, COUNT(o.outlet_id) AS total, (${qocs}) AS totals, CONCAT(TRUNCATE((COUNT(o.outlet_id)/(${qocs}) * 100), 2), '%') AS bobot_outlet, TRUNCATE((IFNULL(regist, 0)/(COUNT(o.outlet_id)) * 100), 2) AS pencapaian FROM ms_head_region AS mhr INNER JOIN ms_pulau_alias AS reg ON reg.head_region_id = mhr.head_region_id INNER JOIN mstr_outlet AS o ON o.region_id = reg.pulau_id_alias INNER JOIN mstr_distributor AS d ON o.distributor_id = d.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_pic AS pic ON pic.kode_pic = dp.ass_id LEFT JOIN (${qr}) AS sub ON sub.ass_id = pic.kode_pic WHERE o.outlet_id IS NOT NULL`
    );
    return await db.query(
      query + ` GROUP BY nama_pic ORDER BY pencapaian ${sort} LIMIT 5`,
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [...pr, ...pocs, ...pocs, ...params],
      }
    );
  }
  async getLastRegistration(req: Request): Promise<any> {
    let q =
      "SELECT fr.outlet_id, fr.tgl_upload, o.outlet_name FROM trx_file_registrasi AS fr INNER JOIN mstr_outlet AS o ON o.outlet_id = fr.outlet_id INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg. pulau_id_alias INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_periode_registrasi pr ON pr.id = fr. periode_id WHERE fr.tgl_upload BETWEEN pr.tgl_mulai AND pr.tgl_selesai AND fr.type_file = 0";

    let { query, params } = FilterParams.register(req, q);

    return await db.query(query + " order by fr.tgl_upload DESC LIMIT 5", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: params,
    });
  }
  async getRegistrationFile(req: Request, type_file?: number): Promise<any> {
    const { outlet_id } = req.validated;
    if (!type_file) type_file = 0;
    let query =
      "SELECT f.*, s.status FROM trx_file_registrasi AS f INNER JOIN ms_status_registrasi AS s ON s.id = f.status_registrasi WHERE outlet_id = ? AND type_file = ?";

    return await db.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [outlet_id, type_file],
    });
  }
  async getRegistrationHistory(req: Request): Promise<any> {
    const { file_id } = req.validated;
    let query =
      "SELECT h.*, s.status FROM trx_history_registrasi AS h INNER JOIN ms_status_registrasi AS s ON h.status_registrasi = s.id WHERE h.file_id = ?";

    return await db.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [file_id],
    });
  }
  async getRegistrationForm(req: Request, type_file?: number): Promise<any> {
    if (!type_file) type_file = 0;
    const { outlet_id, periode_id, file_id } = req.validated;
    let query =
      "SELECT fr.*, s.level FROM trx_file_registrasi AS fr INNER JOIN ms_status_registrasi AS s ON s.id = fr.status_registrasi WHERE outlet_id = ? AND (periode_id = ? OR fr.id = ?) AND type_file = ?";

    return await db.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [outlet_id, periode_id, file_id, type_file],
    });
  }
  async insertRegistrationForm(req: Request, t: any): Promise<any> {
    const { outlet_id, periode_id, filename, tgl_upload } = req.validated;
    let query =
      "INSERT INTO trx_file_registrasi (outlet_id, periode_id, filename, tgl_upload) VALUES(?, ?, ?, ?)";
    let queryHistory =
      "INSERT INTO trx_history_registrasi (outlet_id, file_id, created_at) VALUES(?, ?, ?)";

    await db.query(
      "INSERT INTO trx_history_file_registrasi (outlet_id, periode_id, filename, tgl_upload) VALUES(?, ?, ?, ?)",
      {
        raw: true,
        type: QueryTypes.INSERT,
        replacements: [outlet_id, periode_id, filename, tgl_upload],
        transaction: t,
      }
    );
    const insert = await db.query(query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: [outlet_id, periode_id, filename, tgl_upload],
      transaction: t,
    });
    await db.query("UPDATE mstr_outlet SET formulir = ? WHERE outlet_id = ?", {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: [insert[0], outlet_id],
      transaction: t,
    });

    return await db.query(queryHistory, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: [outlet_id, insert[0], tgl_upload],
      transaction: t,
    });
  }
  async validation(req: Request, t: any): Promise<any> {
    const { outlet_id, file_id, status_registrasi, validated_at } =
      req.validated;
    let query =
      "UPDATE trx_file_registrasi SET status_registrasi = ?, validated_at = ? WHERE outlet_id = ? AND id = ?";

    let queryHistory =
      "INSERT INTO trx_history_registrasi (outlet_id, status_registrasi, file_id, created_at) VALUES(?, ?, ?, ?)";

    if (status_registrasi === 7 || status_registrasi === 8) {
      await db.query(
        "UPDATE mstr_outlet SET register_at = ?, valid = 'Yes+' WHERE outlet_id = ?",
        {
          raw: true,
          type: QueryTypes.UPDATE,
          replacements: [validated_at, outlet_id],
          transaction: t,
        }
      );
    }

    await db.query(query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: [status_registrasi, validated_at, outlet_id, file_id],
      transaction: t,
    });

    return await db.query(queryHistory, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: [outlet_id, status_registrasi, file_id, validated_at],
      transaction: t,
    });
  }
  async updateRegistrationForm(req: Request, t: any): Promise<any> {
    const { outlet_id, periode_id, filename, tgl_upload } = req.validated;
    let query =
      "UPDATE trx_file_registrasi SET filename = ?, tgl_upload = ?, status_registrasi = ? WHERE outlet_id = ? AND periode_id = ?";

    await db.query(
      "INSERT INTO trx_history_file_registrasi (outlet_id, periode_id, filename, tgl_upload) VALUES(?, ?, ?, ?)",
      {
        raw: true,
        type: QueryTypes.INSERT,
        replacements: [outlet_id, periode_id, filename, tgl_upload],
        transaction: t,
      }
    );

    return await db.query(query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: [filename, tgl_upload, 2, outlet_id, periode_id],
    });
  }
  async getRegistrationStatus(req: Request): Promise<any> {
    let query = "SELECT * FROM ms_status_registrasi";

    return await db.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
    });
  }
  async getRegistrationSummaryByMonth(req: Request): Promise<any> {
    let { query, params } = FilterParams.count(req, queryOutletCount);
    let { query: qreg, params: preg } = FilterParams.count(
      req,
      "SELECT COUNT(*) AS regist, MONTH(tgl_upload) AS bulan FROM mstr_outlet AS ou INNER JOIN trx_file_registrasi AS fr ON fr.outlet_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.`region_id` = r. `pulau_id_alias` INNER JOIN ms_dist_pic AS pic ON ou.`distributor_id` = pic.`distributor_id` WHERE ou.`outlet_id` IS NOT NULL AND fr.type_file = 0"
    );

    return await db.query(
      `SELECT b.*, c.regist, (${query}) AS outlet FROM ms_bulan AS b LEFT JOIN (${qreg} GROUP BY bulan) AS c ON c.bulan = b.id ORDER BY b.id`,
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [...params, ...preg],
      }
    );
  }
  async getRegistrationReportByMonth(req: Request): Promise<any> {
    const status = await db.query("SELECT * FROM ms_status_registrasi", {
      raw: true,
      type: QueryTypes.SELECT,
    });

    let q = "";
    status.map((e: any, i: number) => {
      q += `COUNT(CASE WHEN status_registrasi = ${e.id} THEN tr.id END) AS '${e.status}'`;
      if (i + 1 !== status.length) return (q += ", ");
    });

    let { query: qoc, params } = FilterParams.count(req, queryOutletCount);

    let query = `SELECT b.id, b.bulan, COUNT(tr.outlet_id) AS outlet, (${qoc}) AS totals, ${q} FROM ms_bulan AS b LEFT JOIN trx_file_registrasi AS tr ON b.id = MONTH(tr.tgl_upload) LEFT JOIN ms_status_registrasi AS s ON tr.status_registrasi = s.id WHERE tr.type_file = 0 OR tr.type_file IS NULL GROUP BY b.id`;

    return await db.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...params],
    });
  }
  async deleteRegistrationFile(id: number): Promise<any> {
    let query = "DELETE FROM trx_file_registrasi WHERE id = ?";

    return await db.query(query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: [id],
    });
  }
  async getOutletData(outlet_id: string): Promise<any> {
    // const { outlet_id } = req.validated;
    let query =
      "SELECT outlet_id, outlet_name, jenis_badan, ektp, npwp, kodepos, rtrw, kelurahan, kecamatan, kabupaten, propinsi, no_wa, alamat1, nama_rekening, nomor_rekening, nama_bank, cabang_bank, kota_bank FROM mstr_outlet WHERE outlet_id = ?";

    return await db.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [outlet_id],
    });
  }
  async getOutletProgram(outlet_id: string): Promise<any> {
    // const { outlet_id } = req.validated;
    let query =
      "SELECT po.*, mp.nama_program, mp.jenis_hadiah FROM trx_program_outlet AS po INNER JOIN ms_program AS mp ON mp.kode_program = po.kode_program WHERE outlet_id = ?";

    return await db.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [outlet_id],
    });
  }
  async updateOutletData(req: Request, t: any): Promise<any> {
    let { outlet_id, file, periode_id } = req.validated;
    delete req.validated.periode_id;
    delete req.validated.file;
    const deleted = file.type === "npwp" ? "ektp" : "npwp";
    req.validated = { ...req.validated, [deleted]: null };
    const OutletColumns: any[] = Object.keys(req.validated);
    const OutletValues: any[] = Object.values(req.validated);

    await db.query(
      `UPDATE mstr_outlet SET ${OutletColumns.join(
        " = ?, "
      )} = ? WHERE outlet_id = ?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [...OutletValues, outlet_id],
        transaction: t,
      }
    );

    if (file) {
      file = { ...file, periode_id };
      if (file[file.type + "_file"]) {
        const type_file = file.type === "npwp" ? 2 : 1;

        await db.query(
          `INSERT INTO trx_history_file_registrasi (outlet_id, periode_id, filename, tgl_upload, type_file) VALUES ?`,
          {
            raw: true,
            type: QueryTypes.INSERT,
            replacements: [
              [
                [
                  outlet_id,
                  periode_id,
                  file[file.type + "_file"],
                  file.tgl_upload,
                  type_file,
                ],
              ],
            ],
            transaction: t,
          }
        );
        await db.query(
          `INSERT INTO trx_file_registrasi (outlet_id, periode_id, filename, tgl_upload, type_file) VALUES ?`,
          {
            raw: true,
            type: QueryTypes.INSERT,
            replacements: [
              [
                [
                  outlet_id,
                  periode_id,
                  file[file.type + "_file"],
                  file.tgl_upload,
                  type_file,
                ],
              ],
            ],
            transaction: t,
          }
        );
      }
      if (file.bank) {
        await db.query(
          `INSERT INTO trx_history_file_registrasi (outlet_id, periode_id, filename, tgl_upload, type_file) VALUES ?`,
          {
            raw: true,
            type: QueryTypes.INSERT,
            replacements: [
              [[outlet_id, periode_id, file.bank, file.tgl_upload, 3]],
            ],
            transaction: t,
          }
        );
        await db.query(
          `INSERT INTO trx_file_registrasi (outlet_id, periode_id, filename, tgl_upload, type_file) VALUES ?`,
          {
            raw: true,
            type: QueryTypes.INSERT,
            replacements: [
              [[outlet_id, periode_id, file.bank, file.tgl_upload, 3]],
            ],
            transaction: t,
          }
        );
      }
    }

    return true;
  }
}

export default new Registration();
