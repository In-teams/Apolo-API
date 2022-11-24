import {Request} from "express";
import moment from "moment";
import {QueryTypes} from "sequelize";
import db from "../config/db";

class Periode {
  async gets(req: Request): Promise<any> {
    return await db.query("SELECT * FROM ms_periode_registrasi", {
      raw: true,
      type: QueryTypes.SELECT,
    });
  }
  async get(id: number): Promise<any> {
    return await db.query("SELECT * FROM ms_periode_registrasi WHERE id = ?", {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [id],
    });
  }
  async checkData(req: Request): Promise<any> {
    // const { tgl_mulai = moment().format('YYY-MM-DD'), tgl_selesai } = req.validated;
    const tgl_mulai = req.validated?.tgl_mulai || moment().format("YYYY-MM-DD");
    const tgl_selesai =
      req.validated?.tgl_selesai || moment().format("YYYY-MM-DD");
    return await db.query(
      "SELECT * FROM ms_periode_registrasi WHERE ? BETWEEN tgl_mulai AND tgl_selesai OR ? BETWEEN tgl_mulai AND tgl_selesai",
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [tgl_mulai, tgl_selesai],
      }
    );
  }
  async create(req: Request): Promise<any> {
    const { periode, tgl_mulai, tgl_selesai } = req.body;
    return await db.query(
      "INSERT INTO ms_periode_registrasi (periode,tgl_mulai,tgl_selesai) VALUES (?, ?, ?)",
      {
        raw: true,
        type: QueryTypes.INSERT,
        replacements: [periode, tgl_mulai, tgl_selesai],
      }
    );
  }
  async update(req: Request): Promise<any> {
    const { id, tgl_mulai, tgl_selesai, periode } = req.validated;
    delete req.validated.id;
    return await db.query(
      "UPDATE ms_periode_registrasi SET periode = ?, tgl_mulai = ?, tgl_selesai = ? WHERE id = ?",
      {
        raw: true,
        type: QueryTypes.UPDATE,
        replacements: [periode, tgl_mulai, tgl_selesai, id],
      }
    );
  }
  async delete(req: Request): Promise<any> {
    const { id } = req.validated;
    return await db.query("DELETE FROM ms_periode_registrasi WHERE id = ?", {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: [id],
    });
  }
}

export default new Periode();
