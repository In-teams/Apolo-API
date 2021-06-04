import { Request } from "express";
import db from "../config/db";

class Periode {
  get(req: Request): any {
    return db().select("pr.*").from("ms_periode_registrasi as pr");
  }
  checkData(req: Request): any {
    const { tgl_mulai, tgl_selesai } = req.validated;
    return this.get(req)
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
    //  select `pr`.* from `ms_periode_registrasi` as `pr`
    // where ? BETWEEN pr.tgl_mulai AND pr.tgl_selesai or ? BETWEEN pr.tgl_mulai AND pr.tgl_selesai
  }
  create(req: Request): any {
    return db().insert(req.validated).into("ms_periode_registrasi");
  }
  update(req: Request): any {
    const { id } = req.validated;
    delete req.validated.id;
    return db()("ms_periode_registrasi").where({ id }).update(req.validated);
  }
  delete(req: Request): any {
    const { id } = req.validated;
    return db()("ms_periode_registrasi").where({ id }).delete();
  }
}

export default new Periode();
