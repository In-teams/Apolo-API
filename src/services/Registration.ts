import { Request } from "express";
import { QueryTypes } from "sequelize";
import db from "../config/db";
import FilterParams from "../helpers/FilterParams";

let queryOutletCount =
  "SELECT COUNT(DISTINCT ou.outlet_id) AS total FROM mstr_outlet AS ou INNER JOIN ms_pulau_alias AS r ON ou.`region_id` = r. `pulau_id_alias` INNER JOIN ms_dist_pic AS pic ON ou.`distributor_id` = pic.`distributor_id` WHERE ou.`outlet_id` IS NOT NULL";

class Registration {
  async getRegistrationSummary(req: Request): Promise<any> {
    let { query: qoc, params: poc } = FilterParams.count(req, queryOutletCount);
    let q = `SELECT (${qoc}) AS total_outlet, COUNT(DISTINCT o.outlet_id) AS total FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL AND o.valid NOT IN ('No', 'No+')`;

    let { query, params } = FilterParams.register(req, q);
    return await db.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...poc, ...params],
    });
  }
  async getRegistrationSummaryByHR(req: Request): Promise<any> {
    const { sort } = req.validated;
    let { query: qoc, params: poc } = FilterParams.count(
      req,
      queryOutletCount +
        " AND ou.valid IN ('No', 'No+') AND r.head_region_id = mhr.head_region_id"
    );
    let { query: qocs, params: pocs } = FilterParams.count(
      req,
      queryOutletCount
    );
    let q = `SELECT mhr.head_region_name as wilayah, (${qoc}) AS notregist, COUNT(o.outlet_id) AS regist, ((${qoc}) + COUNT(o.outlet_id)) AS total, TRUNCATE((COUNT(o.outlet_id)/((${qoc}) + COUNT(o.outlet_id)) * 100), 2) AS pencapaian, (${qocs}) AS totals, CONCAT(TRUNCATE((COUNT(o.outlet_id)/(${qocs}) * 100), 2), '%') AS bobot_outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg. pulau_id_alias INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL AND o.valid NOT IN ('No', 'No+')`;

    let { query, params } = FilterParams.register(req, q);
    return await db.query(
      query + ` GROUP BY wilayah ORDER BY pencapaian ${sort}`,
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [...poc, ...poc, ...poc, ...pocs, ...pocs, ...params],
      }
    );
  }
  async getRegistrationSummaryByRegion(req: Request): Promise<any> {
    const { sort } = req.validated;
    let { query: qoc, params: poc } = FilterParams.count(
      req,
      queryOutletCount +
        " AND ou.valid IN ('No', 'No+') AND r.pulau_id_alias = reg.pulau_id_alias"
    );
    let { query: qocs, params: pocs } = FilterParams.count(
      req,
      queryOutletCount
    );
    let q = `SELECT reg.nama_pulau_alias as region, (${qoc}) AS notregist, COUNT(o.outlet_id) AS regist, ((${qoc}) + COUNT(o.outlet_id)) AS total, TRUNCATE((COUNT(o.outlet_id)/((${qoc}) + COUNT(o.outlet_id)) * 100), 2) AS pencapaian, (${qocs}) AS totals, CONCAT(TRUNCATE((COUNT(o.outlet_id)/(${qocs}) * 100), 2), '%') AS bobot_outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg. pulau_id_alias INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL AND o.valid NOT IN ('No', 'No+')`;

    let { query, params } = FilterParams.register(req, q);
    return await db.query(
      query + ` GROUP BY region ORDER BY pencapaian ${sort} LIMIT 5`,
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [...poc, ...poc, ...poc, ...pocs, ...pocs, ...params],
      }
    );
  }
  async getRegistrationSummaryByArea(req: Request): Promise<any> {
    const { sort } = req.validated;
    let { query: qoc, params: poc } = FilterParams.query(
      req,
      queryOutletCount +
        " AND ou.valid IN ('No', 'No+') AND ou.city_id_alias = c.city_id_alias"
    );
    let { query: qocs, params: pocs } = FilterParams.count(
      req,
      queryOutletCount
    );
    let q = `SELECT c.city_name_alias as area, (${qoc}) AS notregist, COUNT(o.outlet_id) AS regist, ((${qoc}) + COUNT(o.outlet_id)) AS total, TRUNCATE((COUNT(o.outlet_id)/((${qoc}) + COUNT(o.outlet_id)) * 100), 2) AS pencapaian, (${qocs}) AS totals, CONCAT(TRUNCATE((COUNT(o.outlet_id)/(${qocs}) * 100), 2), '%') AS bobot_outlet FROM mstr_outlet AS o INNER JOIN ms_city_alias AS c ON o.city_id_alias = c.city_id_alias INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg. pulau_id_alias INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL AND o.valid NOT IN ('No', 'No+')`;

    let { query, params } = FilterParams.register(req, q);
    return await db.query(
      query + ` GROUP BY area ORDER BY pencapaian ${sort} LIMIT 5`,
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [...poc, ...poc, ...poc, ...pocs, ...pocs, ...params],
      }
    );
  }
  async getRegistrationSummaryByDistributor(req: Request): Promise<any> {
    const { sort } = req.validated;
    let { query: qoc, params: poc } = FilterParams.query(
      req,
      queryOutletCount +
        " AND ou.valid IN ('No', 'No+') AND ou.distributor_id = d.distributor_id"
    );
    let { query: qocs, params: pocs } = FilterParams.count(
      req,
      queryOutletCount
    );
    let q = `SELECT d.distributor_name as distributor, (${qoc}) AS notregist, COUNT(o.outlet_id) AS regist, ((${qoc}) + COUNT(o.outlet_id)) AS total, TRUNCATE((COUNT(o.outlet_id)/((${qoc}) + COUNT(o.outlet_id)) * 100), 2) AS pencapaian, (${qocs}) AS totals, CONCAT(TRUNCATE((COUNT(o.outlet_id)/(${qocs}) * 100), 2), '%') AS bobot_outlet FROM mstr_outlet AS o INNER JOIN mstr_distributor AS d ON o.distributor_id = d.distributor_id INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg. pulau_id_alias INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL AND o.valid NOT IN ('No', 'No+')`;

    let { query, params } = FilterParams.register(req, q);
    return await db.query(
      query + ` GROUP BY distributor ORDER BY pencapaian ${sort} LIMIT 5`,
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [...poc, ...poc, ...poc, ...pocs, ...pocs, ...params],
      }
    );
  }
  async getRegistrationSummaryByOutlet(req: Request): Promise<any> {
    const { sort } = req.validated;
    let { query: qoc, params: poc } = FilterParams.query(
      req,
      queryOutletCount +
        " AND ou.valid IN ('No', 'No+') AND ou.outlet_id = o.outlet_id"
    );
    let { query: qocs, params: pocs } = FilterParams.count(
      req,
      queryOutletCount
    );
    let q = `SELECT o.outlet_name as outlet, (${qoc}) AS notregist, COUNT(o.outlet_id) AS regist, ((${qoc}) + COUNT(o.outlet_id)) AS total, TRUNCATE((COUNT(o.outlet_id)/((${qoc}) + COUNT(o.outlet_id)) * 100), 2) AS pencapaian, (${qocs}) AS totals, CONCAT(TRUNCATE((COUNT(o.outlet_id)/(${qocs}) * 100), 2), '%') AS bobot_outlet FROM mstr_outlet AS o INNER JOIN mstr_distributor AS d ON o.distributor_id = d.distributor_id INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg. pulau_id_alias INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL AND o.valid NOT IN ('No', 'No+')`;

    let { query, params } = FilterParams.register(req, q);
    return await db.query(
      query + ` GROUP BY outlet ORDER BY pencapaian ${sort} LIMIT 5`,
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [...poc, ...poc, ...poc, ...pocs, ...pocs, ...params],
      }
    );
  }
  async getLastRegistration(req: Request): Promise<any> {
    let q =
      "select distinct o.* from mstr_outlet as o INNER JOIN ms_pulau_alias as reg on o.region_id = reg.pulau_id_alias INNER JOIN ms_user_scope as us on o.outlet_id = us.scope INNER JOIN ms_dist_pic as dp on o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL AND o.register_at IS NOT NULL AND o.valid NOT IN('No', 'No+')";

    let { query, params } = FilterParams.register(req, q);

    return await db.query(query + " order by o.register_at DESC", {
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
      "SELECT * FROM trx_file_registrasi WHERE outlet_id = ? AND (periode_id = ? OR id = ?) AND type_file = ?";

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

    let {query, params} = FilterParams.count(req, queryOutletCount)
    let {query: qreg, params: preg} = FilterParams.count(req, "SELECT COUNT(*) AS regist, MONTH(tgl_upload) AS bulan FROM mstr_outlet AS ou INNER JOIN trx_file_registrasi AS fr ON fr.outlet_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.`region_id` = r. `pulau_id_alias` INNER JOIN ms_dist_pic AS pic ON ou.`distributor_id` = pic.`distributor_id` WHERE ou.`outlet_id` IS NOT NULL")

    return await db.query(`SELECT b.*, c.regist, (${query}) AS outlet FROM ms_bulan AS b LEFT JOIN (${qreg} GROUP BY bulan) AS c ON c.bulan = b.id ORDER BY b.id`, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [...params, ...preg],
    });
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
  async getOutletData(req: Request): Promise<any> {
    const { outlet_id } = req.validated;
    let query = "SELECT * FROM mstr_outlet WHERE outlet_id = ?";

    return await db.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [outlet_id],
    });
  }
  async updateOutletData(req: Request, t: any): Promise<any> {
    const {
      type,
      outlet_id,
      nama,
      no_npwp,
      no_ektp,
      ektp,
      npwp,
      no_hp,
      alamat,
      rtrw,
      kode_pos,
      provinsi,
      kabupaten,
      kecamatan,
      kelurahan,
      bank,
      periode_id,
      tgl_upload,
    } = req.validated;
    let queryBaseEKTP =
      "UPDATE mstr_outlet SET nama_konsumen = ?, ektp = ?, alamat1 = ?, rtrw = ?, kelurahan = ?, kecamatan = ?, kabupaten = ?, propinsi = ?, kodepos = ?, no_wa = ? WHERE outlet_id = ?";
    let queryBaseNPWP =
      "UPDATE mstr_outlet SET nama_konsumen = ?, npwp = ?, alamat1 = ?, rtrw = ?, kelurahan = ?, kecamatan = ?, kabupaten = ?, propinsi = ?, kodepos = ?, no_wa = ? WHERE outlet_id = ?";

    let params: any[] =
      type === "ektp"
        ? [
            nama, no_ektp,
            alamat, rtrw,
            kelurahan, kecamatan,
            kabupaten, provinsi,
            kode_pos, no_hp,
            outlet_id,
          ]
        : [
            nama, no_npwp,
            alamat, rtrw,
            kelurahan, kecamatan,
            kabupaten, provinsi,
            kode_pos, no_hp,
            outlet_id,
          ];

    await db.query(type === "ektp" ? queryBaseEKTP : queryBaseNPWP, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: params,
      transaction: t,
    });

    const file = npwp ? npwp : ektp;
    const type_file = npwp ? 2 : 1;

    await db.query(
      "INSERT INTO trx_history_file_registrasi (outlet_id, periode_id, filename, tgl_upload, type_file) VALUES ?",
      {
        raw: true,
        type: QueryTypes.INSERT,
        replacements: [
          [
            [outlet_id, periode_id, file, tgl_upload, type_file],
            [outlet_id, periode_id, bank, tgl_upload, 3],
          ],
        ],
        transaction: t,
      }
    );

    return await db.query(
      "INSERT INTO trx_file_registrasi (outlet_id, periode_id, filename, tgl_upload, type_file) VALUES ?",
      {
        raw: true,
        type: QueryTypes.INSERT,
        replacements: [
          [
            [outlet_id, periode_id, file, tgl_upload, type_file],
            [outlet_id, periode_id, bank, tgl_upload, 3],
          ],
        ],
        transaction: t,
      }
    );
  }
}

export default new Registration();
