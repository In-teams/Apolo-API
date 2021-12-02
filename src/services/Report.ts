import { QueryTypes } from "sequelize";
import db from "../config/db";

class Report {
  async getSalesReportPerSubBrand(): Promise<any> {
    return await db.query(
      "SELECT i.`item_name` AS subbrand, s.`nama_signature` AS brand, c.`nama_category` AS kategory, CAST(SUM(trb.sales) as INTEGER) AS aktual, CAST(SUM(trbh.sales) AS INTEGER) AS historical, CAST(SUM(trb.sales) - SUM(trbh.sales) AS INTEGER) AS gap FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.`kd_transaksi` = trb.`kd_transaksi` INNER JOIN trx_transaksi_barang_historical AS trbh ON trbh.`kd_transaksi` = trb.`kd_transaksi` INNER JOIN mstr_item AS i ON i.`item_code` = trb.`kd_produk` INNER JOIN mstr_signature AS s ON s.`kode_signature` = i.`kode_signature` INNER JOIN mstr_category AS c ON c.`kode_category` = s.`kode_category` GROUP BY subbrand",
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
      "SELECT a.kd_transaksi, no_id, outlet_name, nama_produk, quantity, no_batch, IF(no_batch = 'PPR', 'BY PAPER', 'BY MICROSITE') AS type, a.`file_id`, yy.`level`, yy.`status` AS status_redeem, tgl_transaksi AS proses, z.`tgl_upload` AS penukaran, tanggal_kirim AS kirim, l.tgl_confirm AS otorisasi, j.tanggal AS pengadaan, tanggal_terima AS terima, nama_penerima, z.`filename`, h.status_terima, distributor_name, no_handphone FROM trx_transaksi_redeem a INNER JOIN mstr_outlet b ON a.no_id = b.outlet_id INNER JOIN trx_transaksi_redeem_barang f ON f.kd_transaksi = a.kd_transaksi LEFT JOIN trx_file_penukaran AS z ON z.`id` = a.`file_id` LEFT JOIN ms_status_penukaran AS yy ON yy.`id` = z.`status_penukaran` LEFT JOIN trx_transaksi_pulsa g ON g.kd_transaksi = a.kd_transaksi LEFT JOIN ( SELECT `kd_transaksi`, `tanggal_kirim`, `tanggal_terima`, nama_penerima, `status_terima`, id FROM ( SELECT `kd_transaksi`, `tanggal_kirim`, `tanggal_terima`, nama_penerima, `status_terima`, id FROM `trx_status` UNION SELECT `transfer_id` AS `kd_transaksi`, `tgl_transfer` AS `tanggal_kirim`, `tgl_transfer` AS `tanggal_terima`, `noreferensi` AS `nama_penerima`, IF( `noreferensi` IS NULL, 'PROSES PENUKARAN', 'TELAH DITERIMA' ) AS status_terima, id FROM `trx_pc_list` ) a GROUP BY kd_transaksi ) h ON h.kd_transaksi = a.kd_transaksi LEFT JOIN trx_pr_barang i ON i.kd_transaksi = a.kd_transaksi LEFT JOIN trx_pr j ON j.kode_pr = i.kode_pr LEFT JOIN trx_confirm_detail k ON k.kd_transaksi = a.kd_transaksi LEFT JOIN trx_confirm l ON l.id_confirm = k.id_confirm INNER JOIN `mstr_distributor` m ON m.distributor_id = b.distributor_id WHERE 1 = 1 AND a.`status` = 'R' ORDER BY a.`kd_transaksi` DESC LIMIT ? OFFSET ?",
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [show, thisPage],
      }
    );
  }
  async getRegistrationResumeReport(): Promise<any> {
    return await db.query(
      "SELECT CASE WHEN w.`tgl_respon_wa` IS NULL AND fr.id IS NOT NULL THEN 'BY PAPER' WHEN w.`tgl_respon_wa` IS NOT NULL THEN 'BY WA' WHEN w.`tgl_respon_wa` IS NULL AND fr.id IS NULL THEN 'BELUM REGISTRASI' END AS type, (COUNT(DISTINCT o.`outlet_id`) - COUNT(DISTINCT fr.`id`)) AS level1, COUNT(DISTINCT CASE WHEN sr.`level` = 'Level 2' THEN o.`outlet_id` END) AS level2,  COUNT(CASE WHEN sr.`level` = 'Level 3' THEN o.`outlet_id` END) AS level3, COUNT(CASE WHEN sr.`level` = 'Level 4' THEN o.`outlet_id` END) AS level4, COUNT(DISTINCT o.outlet_id) AS total FROM mstr_outlet AS o LEFT JOIN trx_file_registrasi AS fr ON fr.`outlet_id` = o.`outlet_id` AND fr.`type_file` = 0 LEFT JOIN trx_respon_wa AS w ON w.`outlet_id` = o.`outlet_id` AND w.outlet_id = fr.outlet_id LEFT JOIN ms_status_registrasi AS sr ON sr.`id` = fr.`status_registrasi` GROUP BY type",
      {
        raw: true,
        type: QueryTypes.SELECT,
      }
    );
  }
  async getRedeemResumeReport(): Promise<any> {
    return await db.query(
      "SELECT CASE WHEN platform = 'MS' THEN 'BY MICROSITE' WHEN platform = 'PPR' THEN 'BY PAPER' WHEN platform IS NULL THEN 'BELUM PENUKARAN' END AS type, (COUNT(DISTINCT o.outlet_id) - COUNT(DISTINCT fp.id)) AS level1,	 COUNT(DISTINCT CASE WHEN sp.`level` = 'Level 2' THEN o.`outlet_id` END) AS level2, COUNT(CASE WHEN sp.`level` = 'Level 3' THEN o.`outlet_id` END) AS level3, COUNT(CASE WHEN sp.`level` = 'Level 4' THEN o.`outlet_id` END) AS level4, COUNT(DISTINCT o.outlet_id) AS total FROM mstr_outlet AS o LEFT JOIN trx_file_penukaran AS fp ON fp.`outlet_id` = o.`outlet_id` LEFT JOIN ms_status_penukaran AS sp ON sp.`id` = fp.`status_penukaran` GROUP BY type",
      {
        raw: true,
        type: QueryTypes.SELECT,
      }
    );
  }
}

export default new Report();
