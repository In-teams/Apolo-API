import { QueryTypes } from "sequelize";
import db from "../config/db";

const getRegistrationReportQuery = async (
  data: any,
  isCount: boolean = false,
  isPaging: boolean = true
) => {
  let {
    show = 10,
    level,
    page = 1,
    month,
    quarter_id,
    area_id,
    region_id,
    wilayah_id,
    outlet_id,
    asm_id,
    ass_id,
    distributor_id,
    order = "outlet_id",
    sort = "asc",
  } = data;
  const thisPage = show * page - show;
  let q1 =
    "SELECT fr.*, sr.level, sr.status, p.`periode` FROM trx_file_registrasi AS fr INNER JOIN ms_status_registrasi AS sr ON fr.status_registrasi = sr.id INNER JOIN ms_periode_registrasi AS p ON p.`id` = fr.`periode_id` WHERE fr.type_file = 0";
  let q2 =
    "SELECT tgl_upload AS ektp_upload, outlet_id FROM trx_file_registrasi AS fr INNER JOIN ms_periode_registrasi AS p ON p.`id` = fr.`periode_id` WHERE type_file = 1";
  let q3 =
    "SELECT tgl_upload AS npwp_upload, outlet_id FROM trx_file_registrasi AS fr INNER JOIN ms_periode_registrasi AS p ON p.`id` = fr.`periode_id` WHERE type_file = 2";
  let q4 =
    "SELECT tgl_upload AS bank_upload, outlet_id FROM trx_file_registrasi AS fr INNER JOIN ms_periode_registrasi AS p ON p.`id` = fr.`periode_id` WHERE type_file = 3";
  if (month) {
    q1 += " AND MONTH(tgl_upload) = :month";
    q2 += " AND MONTH(tgl_upload) = :month";
    q3 += " AND MONTH(tgl_upload) = :month";
    q4 += " AND MONTH(tgl_upload) = :month";
  }
  if (quarter_id) {
    q1 += " AND MONTH(tgl_upload) IN (:quarter_id)";
    q2 += " AND MONTH(tgl_upload) IN (:quarter_id)";
    q3 += " AND MONTH(tgl_upload) IN (:quarter_id)";
    q4 += " AND MONTH(tgl_upload) IN (:quarter_id)";
  }
  q1 += " GROUP BY p.id, outlet_id";
  q2 += " GROUP BY p.id, outlet_id";
  q3 += " GROUP BY p.id, outlet_id";
  q4 += " GROUP BY p.id, outlet_id";
  const filterLevel = level
    ? level === 1
      ? "AND fr.level IS NULL"
      : "AND fr.level = :level"
    : "";
  const col = isCount
    ? "COUNT(DISTINCT o.outlet_id) AS total"
    : "periode, o.outlet_id, o.outlet_name, o.no_wa, o.ektp, o.npwp, o.nomor_rekening, o.nama_rekening, mb.nama_bank, o.cabang_bank, o.kota_bank, IFNULL(fr.level, 'Level 1') AS level, IFNULL(fr.status, 'Level 1A - Formulir Tidak Ada') AS status, ektp_upload, npwp_upload, fr.tgl_upload AS form_upload, bank_upload, fr.validated_at, rw.tgl_send_wa, IF( rw.tgl_send_wa, 'BY MICROSITE', IF(fr.tgl_upload, 'BY PAPER', 'BELUM REGISTRASI')) AS type";
  let query = `SELECT ${col} FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON reg.pulau_id_alias = o.region_id INNER JOIN mstr_distributor AS d ON d.distributor_id = o.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id LEFT JOIN(${q1}) AS fr ON fr.outlet_id = o.outlet_id LEFT JOIN(${q2}) AS e ON e.outlet_id = o.outlet_id LEFT JOIN (${q3}) AS n ON n.outlet_id = o.outlet_id LEFT JOIN (${q4}) AS b ON b.outlet_id = o.outlet_id LEFT JOIN trx_respon_wa AS rw ON rw.outlet_id = o.outlet_id LEFT JOIN indonesia.ms_bank AS mb ON mb.id_bank = o.nama_bank WHERE 1=1 ${filterLevel}`;

  if (level) {
    level = "Level " + level;
    // query += " AND level = :level";
  }
  if (area_id) {
    query += " AND o.city_id_alias = :area_id";
  }
  if (region_id) {
    query += " AND o.region_id = :region_id";
  }
  if (distributor_id) {
    query += " AND o.distributor_id = :distributor_id";
  }
  if (outlet_id) {
    query += " AND o.outlet_id = :outlet_id";
  }
  if (wilayah_id) {
    query += " AND reg.head_region_id = :wilayah_id";
  }
  if (asm_id) {
    query += " AND dp.asm_id = :asm_id";
  }
  if (ass_id) {
    query += " AND dp.ass_id = :ass_id";
  }

  if (!isCount) {
    query += ` GROUP BY periode, outlet_id ORDER BY ${order} ${sort}`;
  }
  if(!isCount && isPaging){
    query += ` LIMIT :show OFFSET :thisPage`;
  }
  return await db.query(query, {
    raw: true,
    type: QueryTypes.SELECT,
    replacements: {
      area_id,
      region_id,
      wilayah_id,
      distributor_id,
      outlet_id,
      asm_id,
      ass_id,
      month,
      show,
      thisPage,
      quarter_id,
      level,
    },
  });
};

const getRedeemReportQuery = async (data: any, isCount: boolean = false) => {
  let {
    month,
    level,
    quarter_id,
    area_id,
    region_id,
    wilayah_id,
    outlet_id,
    asm_id,
    ass_id,
    distributor_id,
    show = 10,
    page = 1,
  } = data;
  const thisPage = show * page - show;
  const col = isCount
    ? "COUNT(no_id) AS total"
    : "a.kd_transaksi, no_id AS outlet_id, outlet_name, nama_produk, quantity, point_satuan, (CAST(quantity AS UNSIGNED) * CAST(point_satuan AS UNSIGNED)) as point_total, no_batch, IF(no_batch = 'PPR', 'BY PAPER', 'BY MICROSITE') AS type, a.`file_id`, yy.`level`, yy.`status` AS status_redeem, tgl_transaksi AS proses, z.`tgl_upload` AS penukaran, tanggal_kirim AS kirim, l.tgl_confirm AS otorisasi, j.tanggal AS pengadaan, tanggal_terima AS terima, nama_penerima, z.`filename`, IF(h.status_terima IS NULL, IF(l.tgl_confirm IS NULL, 'OTORISASI', IF(j.`tanggal` IS NULL, 'PENGADAAN', 'PROSES PENGIRIMAN')), h.status_terima) AS status_terima, distributor_name, no_handphone";
  let query = `SELECT ${col} FROM trx_transaksi_redeem a INNER JOIN mstr_outlet o ON a.no_id = o.outlet_id INNER JOIN ms_pulau_alias AS reg ON reg.pulau_id_alias = o.region_id INNER JOIN mstr_distributor AS d ON d.distributor_id = o.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN trx_transaksi_redeem_barang f ON f.kd_transaksi = a.kd_transaksi LEFT JOIN trx_file_penukaran AS z ON z.id = a.file_id LEFT JOIN ms_status_penukaran AS yy ON yy.id = z.status_penukaran LEFT JOIN trx_transaksi_pulsa g ON g.kd_transaksi = a.kd_transaksi LEFT JOIN ( SELECT kd_transaksi, tanggal_kirim, tanggal_terima, nama_penerima, status_terima, id FROM ( SELECT kd_transaksi, tanggal_kirim, tanggal_terima, nama_penerima, status_terima, id FROM trx_status UNION SELECT transfer_id AS kd_transaksi, tgl_transfer AS tanggal_kirim, tgl_transfer AS tanggal_terima, noreferensi AS nama_penerima, IF( noreferensi IS NULL, 'PROSES PENUKARAN', 'TELAH DITERIMA' ) AS status_terima, id FROM trx_pc_list ) a GROUP BY kd_transaksi ) h ON h.kd_transaksi = a.kd_transaksi LEFT JOIN trx_pr_barang i ON i.kd_transaksi = a.kd_transaksi LEFT JOIN trx_pr j ON j.kode_pr = i.kode_pr LEFT JOIN trx_confirm_detail k ON k.kd_transaksi = a.kd_transaksi LEFT JOIN trx_confirm l ON l.id_confirm = k.id_confirm WHERE 1 = 1 AND a.status = 'R'`;

  if (month) {
    query += " AND MONTH(a.tgl_transaksi) = :month";
  }
  if (level) {
    level = "Level " + level;
    query += " AND yy.`level` = :level";
  }
  if (quarter_id) {
    query += " AND MONTH(a.tgl_transaksi) IN(:quarter_id)";
  }
  if (area_id) {
    query += " AND o.city_id_alias = :area_id";
  }
  if (region_id) {
    query += " AND o.region_id = :region_id";
  }
  if (distributor_id) {
    query += " AND o.distributor_id = :distributor_id";
  }
  if (outlet_id) {
    query += " AND o.outlet_id = :outlet_id";
  }
  if (wilayah_id) {
    query += " AND reg.head_region_id = :wilayah_id";
  }
  if (asm_id) {
    query += " AND dp.asm_id = :asm_id";
  }
  if (ass_id) {
    query += " AND dp.ass_id = :ass_id";
  }

  if (!isCount) {
    query += " ORDER BY a.`kd_transaksi` DESC LIMIT :show OFFSET :thisPage";
  }
  return await db.query(query, {
    raw: true,
    type: QueryTypes.SELECT,
    replacements: {
      area_id,
      region_id,
      wilayah_id,
      distributor_id,
      outlet_id,
      asm_id,
      ass_id,
      show,
      thisPage,
      month,
      quarter_id,
      level,
    },
  });
};

const getPointActivityQuery = async (data: any, isCount: boolean = false) => {
  let {
    month,
    level,
    quarter_id,
    area_id,
    region_id,
    wilayah_id,
    outlet_id,
    asm_id,
    ass_id,
    distributor_id,
    show = 10,
    page = 1,
  } = data;
  const thisPage = show * page - show;
  const filterMonth = month ? " AND b.id = :month" : "";
  const filterQuarter = quarter_id ? " AND b.id IN(:quarter_id)" : "";
  const col = isCount
    ? "COUNT(DISTINCT o.outlet_id) AS total"
    : "DISTINCT o.outlet_id, o.outlet_name, sales, target, (TRUNCATE(((sales / target) * 100), 2)) AS pencapaian, poin_achieve, poin_bonus, poin_reguler, poin_redeem, (poin_achieve - poin_redeem) AS sisa, level, status";
  let query = `SELECT ${col} FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON reg.pulau_id_alias = o.region_id INNER JOIN mstr_distributor AS d ON d.distributor_id = o.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id LEFT JOIN (SELECT SUM(st.target_sales) AS target, ou.outlet_id, month_target FROM (SELECT * FROM mstr_sales_target UNION SELECT * FROM mstr_sales_target2 UNION SELECT * FROM mstr_sales_target3 UNION SELECT * FROM mstr_sales_target4 ) AS st INNER JOIN mstr_outlet AS ou ON ou.outlet_id = st.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_bulan AS b ON b.bulan = st.month_target WHERE st.outlet_id IS NOT NULL ${filterMonth} ${filterQuarter} GROUP BY ou.outlet_id) AS st ON st.outlet_id = o.outlet_id LEFT JOIN (SELECT CAST(SUM(trrb.point_satuan * trrb.quantity) AS DECIMAL(20, 2)) AS poin_redeem, ou.outlet_id, MONTH(tr.tgl_transaksi) AS bulan FROM trx_transaksi_redeem AS tr INNER JOIN trx_transaksi_redeem_barang AS trrb ON tr.kd_transaksi = trrb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_bulan AS b ON b.id = MONTH(tr.tgl_transaksi) WHERE ou.outlet_id IS NOT NULL ${filterMonth} ${filterQuarter} GROUP BY ou.outlet_id ) AS z ON z.outlet_id = o.outlet_id LEFT JOIN ( SELECT SUM(trb.sales) AS sales, SUM(trb.point_satuan) AS poin_achieve, o.outlet_id, MONTH(tr.tgl_transaksi) AS bulan FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.kd_transaksi = trb.kd_transaksi INNER JOIN mstr_outlet AS o ON o.outlet_id = tr.no_id INNER JOIN ms_bulan AS b ON b.id = MONTH(tr.tgl_transaksi) WHERE o.outlet_id IS NOT NULL ${filterMonth} ${filterQuarter} GROUP BY o.outlet_id ) AS p ON o.outlet_id = p.outlet_id LEFT JOIN (SELECT SUM(trb.point_satuan) AS poin_bonus, o.outlet_id, MONTH(tr.tgl_transaksi) AS bulan FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.kd_transaksi = trb.kd_transaksi INNER JOIN mstr_outlet AS o ON o.outlet_id = tr.no_id INNER JOIN ms_bulan AS b ON b.id = MONTH(tr.tgl_transaksi) WHERE o.outlet_id IS NOT NULL AND tr.status = 'B' ${filterMonth} ${filterQuarter} GROUP BY o.outlet_id ) AS s ON o.outlet_id = s.outlet_id LEFT JOIN (SELECT SUM(trb.point_satuan) AS poin_reguler, o.outlet_id, MONTH(tr.tgl_transaksi) AS bulan FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.kd_transaksi = trb.kd_transaksi INNER JOIN mstr_outlet AS o ON o.outlet_id = tr.no_id INNER JOIN ms_bulan AS b ON b.id = MONTH(tr.tgl_transaksi) WHERE o.outlet_id IS NOT NULL AND tr.status = 'A' ${filterMonth} ${filterQuarter} GROUP BY o.outlet_id ) AS t ON o.outlet_id = t.outlet_id LEFT JOIN ( SELECT sp.level, sp.status, o.outlet_id FROM mstr_outlet AS o LEFT JOIN trx_file_penukaran AS fp ON fp.outlet_id = o.outlet_id LEFT JOIN ms_status_penukaran AS sp ON sp.id = fp.status_penukaran INNER JOIN ms_bulan AS b ON b.id = MONTH(fp.tgl_upload) WHERE 1 = 1 ${filterMonth} ${filterQuarter} GROUP BY o.outlet_id ) AS v ON v.outlet_id = o.outlet_id WHERE 1 = 1`;

  if (area_id) {
    query += " AND o.city_id_alias = :area_id";
  }
  if (region_id) {
    query += " AND o.region_id = :region_id";
  }
  if (distributor_id) {
    query += " AND o.distributor_id = :distributor_id";
  }
  if (outlet_id) {
    query += " AND o.outlet_id = :outlet_id";
  }
  if (wilayah_id) {
    query += " AND reg.head_region_id = :wilayah_id";
  }
  if (asm_id) {
    query += " AND dp.asm_id = :asm_id";
  }
  if (ass_id) {
    query += " AND dp.ass_id = :ass_id";
  }

  if (!isCount) {
    query += ` LIMIT :show OFFSET :thisPage`;
  }
  return await db.query(query, {
    raw: true,
    type: QueryTypes.SELECT,
    replacements: {
      area_id,
      region_id,
      wilayah_id,
      distributor_id,
      outlet_id,
      asm_id,
      ass_id,
      show,
      thisPage,
      month,
      quarter_id,
      level,
    },
  });
};

class Report {
  async getSalesReportPerSubBrand(): Promise<any> {
    return await db.query(
      "SELECT DISTINCT i.`item_name` AS subbrand, s.`nama_signature` AS brand, c.`nama_category` AS category, IFNULL(CAST(SUM(trb.sales) AS INTEGER), 0) AS aktual, IFNULL(CAST(SUM(trbh.sales) AS INTEGER), 0) AS historical, IFNULL(CAST(SUM(trb.sales) - SUM(trbh.sales) AS INTEGER), 0) AS gap FROM mstr_item AS i INNER JOIN mstr_signature AS s ON s.`kode_signature` = i.`kode_signature` INNER JOIN mstr_category AS c ON c.`kode_category` = s.`kode_category` LEFT JOIN trx_transaksi_barang AS trb ON i.`item_code` = trb.`kd_produk` LEFT JOIN trx_transaksi AS tr ON tr.`kd_transaksi` = trb.`kd_transaksi` LEFT JOIN trx_transaksi_barang_historical AS trbh ON trbh.`kd_transaksi` = trb.`kd_transaksi` GROUP BY subbrand",
      {
        raw: true,
        type: QueryTypes.SELECT,
        // replacements: [show, thisPage],
      }
    );
  }
  async getPointActivity(data: any): Promise<any> {
    return await getPointActivityQuery(data);
  }
  async getPointActivityCount(data: any): Promise<any> {
    return await getPointActivityQuery(data, true);
  }
  async getSalesReportPerCategory(): Promise<any> {
    return await db.query(
      "SELECT c.`nama_category` AS category, CAST(SUM(trb.sales) as INTEGER) AS aktual, CAST(SUM(trbh.sales) AS INTEGER) AS historical, CAST(SUM(trb.sales) - SUM(trbh.sales) AS INTEGER) AS gap FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.`kd_transaksi` = trb.`kd_transaksi` INNER JOIN trx_transaksi_barang_historical AS trbh ON trbh.`kd_transaksi` = trb.`kd_transaksi` INNER JOIN mstr_item AS i ON i.`item_code` = trb.`kd_produk` INNER JOIN mstr_signature AS s ON s.`kode_signature` = i.`kode_signature` INNER JOIN mstr_category AS c ON c.`kode_category` = s.`kode_category` GROUP BY category",
      {
        raw: true,
        type: QueryTypes.SELECT,
        // replacements: [show, thisPage],
      }
    );
  }
  async getRegistrationReport(data: any): Promise<any> {
    return await getRegistrationReportQuery(data, false);
  }
  async exportRegistrationReport(data: any): Promise<any> {
    return await getRegistrationReportQuery(data, false, false);
  }
  async getRegistrationReportCount(data: any): Promise<any> {
    return await getRegistrationReportQuery(data, true);
  }
  async getRedeemReport(data: any): Promise<any> {
    return await getRedeemReportQuery(data);
  }
  async getRedeemReportCount(data: any): Promise<any> {
    return await getRedeemReportQuery(data, true);
  }
  async getRegistrationResumeReport(data?: any): Promise<any> {
    const {
      month,
      quarter_id,
      area_id,
      region_id,
      wilayah_id,
      outlet_id,
      asm_id,
      ass_id,
      distributor_id,
    } = data;

    let params = [];
    let q = "";
    if (month) {
      q += " AND MONTH(fr.tgl_upload) = ?";
      params.push(month);
    }
    if (quarter_id) {
      q += " AND MONTH(fr.tgl_upload) IN (?)";
      params.push(quarter_id);
    }
    let query = `SELECT CASE WHEN r.id IS NOT NULL THEN 'BY PAPER' WHEN r.id IS NULL THEN 'BELUM REGISTRASI' END AS type, (COUNT(DISTINCT o.outlet_id) - COUNT(DISTINCT r.id)) AS level1, COUNT(DISTINCT CASE WHEN r.level = 'Level 2' THEN o.outlet_id END ) AS level2, COUNT(CASE WHEN r.level = 'Level 3' THEN o.outlet_id END) AS level3, COUNT(CASE WHEN r.level = 'Level 4' THEN o.outlet_id END ) AS level4, COUNT(DISTINCT o.outlet_id) AS total FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON reg.pulau_id_alias = o.region_id INNER JOIN mstr_distributor AS d ON d.distributor_id = o.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id LEFT JOIN (SELECT fr.*, sr.level, sr.status FROM mstr_outlet AS o INNER JOIN trx_file_registrasi AS fr ON o.outlet_id = fr.outlet_id INNER JOIN ms_status_registrasi AS sr ON sr.id = fr.status_registrasi WHERE fr.type_file = 0${q} GROUP BY fr.outlet_id ) AS r ON r.outlet_id = o.outlet_id WHERE o.outlet_id IS NOT NULL`;

    if (area_id) {
      query += " AND o.city_id_alias = ?";
      params.push(area_id);
    }
    if (region_id) {
      query += " AND o.region_id = ?";
      params.push(region_id);
    }
    if (distributor_id) {
      query += " AND o.distributor_id = ?";
      params.push(distributor_id);
    }
    if (outlet_id) {
      query += " AND o.outlet_id = ?";
      params.push(outlet_id);
    }
    if (wilayah_id) {
      query += " AND reg.head_region_id = ?";
      params.push(wilayah_id);
    }
    if (asm_id) {
      query += " AND dp.asm_id = ?";
      params.push(asm_id);
    }
    if (ass_id) {
      query += " AND dp.ass_id = ?";
      params.push(ass_id);
    }

    return await db.query(query + " GROUP BY type", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: params,
    });
  }
  async getRedeemResumeReport(data?: any): Promise<any> {
    const {
      month,
      quarter_id,
      area_id,
      region_id,
      wilayah_id,
      outlet_id,
      asm_id,
      ass_id,
      distributor_id,
    } = data;

    let params = [];
    let q = "";
    if (month) {
      q += " AND MONTH(fp.tgl_upload) = ?";
      params.push(month);
    }
    if (quarter_id) {
      q += " AND MONTH(fp.tgl_upload) IN (?)";
      params.push(quarter_id);
    }
    let query = `SELECT CASE WHEN platform = 'MS' THEN 'BY MICROSITE' WHEN platform = 'PPR' THEN 'BY PAPER' WHEN platform IS NULL THEN 'BELUM PENUKARAN' END AS type, (COUNT(DISTINCT o.outlet_id) - COUNT(DISTINCT sub.id) ) AS level1, COUNT( DISTINCT CASE WHEN sub.level = 'Level 2' THEN o.outlet_id END ) AS level2, COUNT(CASE WHEN sub.level = 'Level 3' THEN o.outlet_id END) AS level3, COUNT(CASE WHEN sub.level = 'Level 4' THEN o.outlet_id END) AS level4, COUNT(DISTINCT o.outlet_id) AS total FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON reg.pulau_id_alias = o.region_id INNER JOIN mstr_distributor AS d ON d.distributor_id = o.distributor_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id LEFT JOIN (SELECT fp.*, sp.level, sp.status FROM mstr_outlet AS o LEFT JOIN trx_file_penukaran AS fp ON fp.outlet_id = o.outlet_id LEFT JOIN ms_status_penukaran AS sp ON sp.id = fp.status_penukaran WHERE 1 = 1 ${q} GROUP BY o.outlet_id ) AS sub ON sub.outlet_id = o.outlet_id WHERE o.outlet_id IS NOT NULL`;

    if (area_id) {
      query += " AND o.city_id_alias = ?";
      params.push(area_id);
    }
    if (region_id) {
      query += " AND o.region_id = ?";
      params.push(region_id);
    }
    if (distributor_id) {
      query += " AND o.distributor_id = ?";
      params.push(distributor_id);
    }
    if (outlet_id) {
      query += " AND o.outlet_id = ?";
      params.push(outlet_id);
    }
    if (wilayah_id) {
      query += " AND reg.head_region_id = ?";
      params.push(wilayah_id);
    }
    if (asm_id) {
      query += " AND dp.asm_id = ?";
      params.push(asm_id);
    }
    if (ass_id) {
      query += " AND dp.ass_id = ?";
      params.push(ass_id);
    }
    return await db.query(query + " GROUP BY type", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: params,
    });
  }
}

export default new Report();
