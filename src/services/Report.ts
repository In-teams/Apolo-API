import { QueryTypes } from "sequelize";
import db from "../config/db";

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
    const { show = 10, page = 1, month = new Date().getMonth() + 1 } = data;
    const thisPage = show * page - show;
    return await db.query(
      "SELECT DISTINCT o.`outlet_id`, sales, target, (TRUNCATE(((sales / target) * 100), 2)) AS pencapaian, poin_achieve, poin_redeem, (poin_achieve - poin_redeem) AS sisa, sp.`level`, sp.`status` FROM mstr_outlet AS o LEFT JOIN trx_file_penukaran AS fp ON fp.`outlet_id` = o.`outlet_id` LEFT JOIN ms_status_penukaran AS sp ON sp.`id` = fp.`status_penukaran` LEFT JOIN (SELECT SUM(st.target_sales) AS target, ou.`outlet_id`, month_target FROM (SELECT * FROM mstr_sales_target UNION SELECT * FROM mstr_sales_target2 UNION SELECT * FROM mstr_sales_target3 UNION SELECT * FROM mstr_sales_target4 ) AS st INNER JOIN mstr_outlet AS ou ON ou.outlet_id = st.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_bulan AS b ON b.bulan = st.month_target WHERE st.outlet_id IS NOT NULL AND b.id = ? GROUP BY ou.`outlet_id`) AS st ON st.outlet_id = o.`outlet_id` LEFT JOIN (SELECT CAST(SUM(trrb.point_satuan * trrb.quantity) AS DECIMAL(20, 2)) AS poin_redeem, ou.`outlet_id`, MONTH(tr.`tgl_transaksi`) AS bulan FROM trx_transaksi_redeem AS tr INNER JOIN trx_transaksi_redeem_barang AS trrb ON tr.kd_transaksi = trrb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id WHERE ou.outlet_id IS NOT NULL AND MONTH(tr.`tgl_transaksi`) = ? GROUP BY ou.`outlet_id`) AS z ON z.outlet_id = o.`outlet_id` LEFT JOIN (SELECT SUM(trb.`sales`) AS sales, SUM(trb.`point_satuan`) AS poin_achieve, o.`outlet_id`, MONTH(tr.`tgl_transaksi`) AS bulan FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.`kd_transaksi` = trb.`kd_transaksi` INNER JOIN mstr_outlet AS o ON o.`outlet_id` = tr.`no_id` WHERE o.`outlet_id` IS NOT NULL AND MONTH(tr.`tgl_transaksi`) = ? GROUP BY o.`outlet_id`) AS p ON o.`outlet_id` = p.outlet_id WHERE (MONTH(fp.`tgl_upload`) = ? OR MONTH(fp.`tgl_upload`) IS NULL) GROUP BY o.`outlet_id` LIMIT ? OFFSET ?",
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [month, month, month, month, show, thisPage],
      }
    );
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
    const { show = 10, page = 1 } = data;
    const thisPage = show * page - show;
    return await db.query(
      "SELECT o.`outlet_id`, o.`outlet_name`, o.`no_wa`, o.`ektp`, o.`npwp`, o.`nomor_rekening`, o.`nama_rekening`, mb.`nama_bank`,  o.`cabang_bank`, o.`kota_bank`, IFNULL(sr.`level`, 'Level 1') AS level, IFNULL(sr.`status`, 'Level 1A - Formulir Tidak Ada') AS status, ektp_upload, npwp_upload, fr.`tgl_upload` AS form_upload, bank_upload, fr.`validated_at`, rw.`tgl_send_wa`, IF(rw.`tgl_send_wa`, 'BY MICROSITE', IF(fr.`tgl_upload`, 'BY PAPER', 'BELUM REGISTRASI')) AS type FROM mstr_outlet AS o LEFT JOIN trx_file_registrasi AS fr ON o.`outlet_id` = fr.`outlet_id` AND type_file = 0 LEFT JOIN ms_status_registrasi AS sr ON fr.`status_registrasi` = sr.`id` LEFT JOIN(SELECT tgl_upload AS ektp_upload, outlet_id FROM trx_file_registrasi WHERE type_file = 1) AS e ON e.outlet_id = o.`outlet_id` LEFT JOIN(SELECT tgl_upload AS npwp_upload, outlet_id FROM trx_file_registrasi WHERE type_file = 2) AS n ON n.outlet_id = o.`outlet_id` LEFT JOIN(SELECT tgl_upload AS bank_upload, outlet_id FROM trx_file_registrasi WHERE type_file = 3) AS b ON b.outlet_id = o.`outlet_id` LEFT JOIN trx_respon_wa AS rw ON rw.`outlet_id` = o.`outlet_id` LEFT JOIN indonesia.`ms_bank` AS mb ON mb.`id_bank` = o.`nama_bank` GROUP BY outlet_id ORDER BY outlet_id LIMIT ? OFFSET ?",
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [show, thisPage],
      }
    );
  }
  async getRedeemReport(data: any): Promise<any> {
    const { show = 10, page = 1 } = data;
    const thisPage = show * page - show;
    return await db.query(
      "SELECT a.kd_transaksi, no_id, outlet_name, nama_produk, quantity, no_batch, IF(no_batch = 'PPR', 'BY PAPER', 'BY MICROSITE') AS type, a.`file_id`, yy.`level`, yy.`status` AS status_redeem, tgl_transaksi AS proses, z.`tgl_upload` AS penukaran, tanggal_kirim AS kirim, l.tgl_confirm AS otorisasi, j.tanggal AS pengadaan, tanggal_terima AS terima, nama_penerima, z.`filename`, IF(h.status_terima IS NULL, IF(l.tgl_confirm IS NULL, 'OTORISASI', IF(j.`tanggal` IS NULL, 'PENGADAAN', 'PROSES PENGIRIMAN')), h.status_terima) AS status_terima, distributor_name, no_handphone FROM trx_transaksi_redeem a INNER JOIN mstr_outlet b ON a.no_id = b.outlet_id INNER JOIN trx_transaksi_redeem_barang f ON f.kd_transaksi = a.kd_transaksi LEFT JOIN trx_file_penukaran AS z ON z.`id` = a.`file_id` LEFT JOIN ms_status_penukaran AS yy ON yy.`id` = z.`status_penukaran` LEFT JOIN trx_transaksi_pulsa g ON g.kd_transaksi = a.kd_transaksi LEFT JOIN ( SELECT `kd_transaksi`, `tanggal_kirim`, `tanggal_terima`, nama_penerima, `status_terima`, id FROM ( SELECT `kd_transaksi`, `tanggal_kirim`, `tanggal_terima`, nama_penerima, `status_terima`, id FROM `trx_status` UNION SELECT `transfer_id` AS `kd_transaksi`, `tgl_transfer` AS `tanggal_kirim`, `tgl_transfer` AS `tanggal_terima`, `noreferensi` AS `nama_penerima`, IF( `noreferensi` IS NULL, 'PROSES PENUKARAN', 'TELAH DITERIMA' ) AS status_terima, id FROM `trx_pc_list` ) a GROUP BY kd_transaksi ) h ON h.kd_transaksi = a.kd_transaksi LEFT JOIN trx_pr_barang i ON i.kd_transaksi = a.kd_transaksi LEFT JOIN trx_pr j ON j.kode_pr = i.kode_pr LEFT JOIN trx_confirm_detail k ON k.kd_transaksi = a.kd_transaksi LEFT JOIN trx_confirm l ON l.id_confirm = k.id_confirm INNER JOIN `mstr_distributor` m ON m.distributor_id = b.distributor_id WHERE 1 = 1 AND a.`status` = 'R' ORDER BY a.`kd_transaksi` DESC LIMIT ? OFFSET ?",
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [show, thisPage],
      }
    );
  }
  async getRegistrationResumeReport(data?:any): Promise<any> {
    const {month = null, area_id = null} = data
    return await db.query(
      `SELECT CASE WHEN r.id IS NOT NULL THEN 'BY PAPER' WHEN r.id IS NULL THEN 'BELUM REGISTRASI' END AS type, (COUNT(DISTINCT o.outlet_id) - COUNT(DISTINCT r.id)) AS level1, COUNT(DISTINCT CASE WHEN r.level = 'Level 2' THEN o.outlet_id END ) AS level2, COUNT(CASE WHEN r.level = 'Level 3' THEN o.outlet_id END) AS level3, COUNT(CASE WHEN r.level = 'Level 4' THEN o.outlet_id END ) AS level4, COUNT(DISTINCT o.outlet_id) AS total FROM mstr_outlet AS o LEFT JOIN (SELECT fr.*, sr.level, sr.status FROM mstr_outlet AS o INNER JOIN trx_file_registrasi AS fr ON o.outlet_id = fr.outlet_id INNER JOIN ms_status_registrasi AS sr ON sr.id = fr.status_registrasi WHERE fr.type_file = 0 AND IF(${month}, MONTH(fr.tgl_upload), 1) = ? AND IF(${area_id}, o.city_id_alias, 1) = ? GROUP BY fr.outlet_id ) AS r ON r.outlet_id = o.outlet_id GROUP BY type`,
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [month, area_id]
      }
    );
  }
  async getRedeemResumeReport(): Promise<any> {
    return await db.query(
      "SELECT CASE WHEN platform = 'MS' THEN 'BY MICROSITE' WHEN platform = 'PPR' THEN 'BY PAPER' WHEN platform IS NULL THEN 'BELUM PENUKARAN' END AS type, (COUNT(DISTINCT o.outlet_id) - COUNT(DISTINCT fp.id)) AS level1, COUNT(DISTINCT CASE WHEN sp.`level` = 'Level 2' THEN o.`outlet_id` END) AS level2, COUNT(CASE WHEN sp.`level` = 'Level 3' THEN o.`outlet_id` END) AS level3, COUNT(CASE WHEN sp.`level` = 'Level 4' THEN o.`outlet_id` END) AS level4, COUNT(DISTINCT o.outlet_id) AS total FROM mstr_outlet AS o LEFT JOIN trx_file_penukaran AS fp ON fp.`outlet_id` = o.`outlet_id` LEFT JOIN ms_status_penukaran AS sp ON sp.`id` = fp.`status_penukaran` GROUP BY type",
      {
        raw: true,
        type: QueryTypes.SELECT,
      }
    );
  }
}

export default new Report();
