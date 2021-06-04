import { Request } from "express";
import db from "../config/db";

class Periode {
  get(req: Request): any {
    const { tgl_mulai, tgl_selesai } = req.validated;
    const query = db()
      .select("pr.*")
      .from("ms_periode_registrasi as pr")
      .whereRaw("? BETWEEN ? AND ?", [
        tgl_mulai,
        db().raw("pr.tgl_mulai"),
        db().raw("pr.tgl_selesai"),
      ])
      .orWhereRaw("? BETWEEN ? AND ?", [
        tgl_selesai,
        db().raw("pr.tgl_mulai"),
        db().raw("pr.tgl_selesai"),
      ]);
    //  select `pr`.* from `ms_periode_registrasi` as `pr` where ? BETWEEN pr.tgl_mulai AND pr.tgl_selesai or ? BETWEEN pr.tgl_mulai AND pr.tgl_selesai
    return query;
  }
  create(req: Request): any {
    return db().insert(req.validated).into("ms_periode_registrasi");
  }
}

export default new Periode();
