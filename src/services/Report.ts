import { QueryTypes } from "sequelize";
import db from "../config/db";

class Report {
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
  async getRegistrationResumeReport(): Promise<any> {
    return await db.query(
      "SELECT CASE WHEN w.`tgl_respon_wa` IS NULL AND fr.id IS NOT NULL THEN 'BY PAPER' WHEN w.`tgl_respon_wa` IS NOT NULL THEN 'BY WA' WHEN w.`tgl_respon_wa` IS NULL AND fr.id IS NULL THEN 'BELUM REGISTRASI' END AS type, (COUNT(DISTINCT o.`outlet_id`) - COUNT(DISTINCT fr.`id`)) AS level1, COUNT(DISTINCT CASE WHEN sr.`level` = 'Level 2' THEN o.`outlet_id` END) AS level2,  COUNT(CASE WHEN sr.`level` = 'Level 3' THEN o.`outlet_id` END) AS level3, COUNT(CASE WHEN sr.`level` = 'Level 4' THEN o.`outlet_id` END) AS level4, COUNT(DISTINCT o.outlet_id) AS total FROM mstr_outlet AS o LEFT JOIN trx_file_registrasi AS fr ON fr.`outlet_id` = o.`outlet_id` AND fr.`type_file` = 0 LEFT JOIN trx_respon_wa AS w ON w.`outlet_id` = o.`outlet_id` AND w.outlet_id = fr.outlet_id LEFT JOIN ms_status_registrasi AS sr ON sr.`id` = fr.`status_registrasi` GROUP BY type",
      {
        raw: true,
        type: QueryTypes.SELECT,
      }
    );
  }
}

export default new Report();
