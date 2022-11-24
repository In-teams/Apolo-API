import joi from "joi";
import {NextFunction, Request, Response} from "express";
import moment from "moment";
import Service from "../services/Periode";
import response from "../helpers/Response";

class Periode {
  async create(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const schema = joi.object({
        periode: joi.string().required(),
        tgl_mulai: joi.date().required(),
        tgl_selesai: joi.date().required(),
      });

      const { value, error } = schema.validate(req.body);
      if (error) {
        return response(res, false, null, error.message, 400);
      }
      if (value.tgl_selesai < value.tgl_mulai)
        return response(
          res,
          false,
          null,
          "tgl selesai tidak boleh lebih kecil dari tgl mulai",
          400
        );

      req.validated = {
        ...value,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      const cekData = await Service.checkData(req);
      if (cekData.length > 0)
        return response(
          res,
          false,
          null,
          "Periode dengan tanggal tersebut sudah ada",
          400
        );

      next();
    } catch (error) {
      console.log(error, "<<<<<< error");
    }
  }
  async update(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const schema = joi.object({
        id: joi.number().required(),
        periode: joi.string(),
        tgl_mulai: joi.date(),
        tgl_selesai: joi.date(),
      });

      const { value, error } = schema.validate({ ...req.body, ...req.params });
      if (error) {
        return response(res, false, null, error.message, 400);
      }

      if (value.tgl_selesai < value.tgl_mulai)
        return response(
          res,
          false,
          null,
          "tgl selesai tidak boleh lebih kecil dari tgl mulai",
          400
        );

      req.validated = value;
      const checkById = await Service.get(value.id);
      if (checkById.length < 1)
        return response(res, false, null, "Periode not found", 404);
      const cekData = await Service.checkData(req);
      if (cekData.length > 0) {
        if (cekData[0].id !== value.id)
          return response(
            res,
            false,
            null,
            "Periode dengan tanggal tersebut sudah ada",
            400
          );

        req.validated.old_tgl_selesai = cekData[0].tgl_selesai;

        next();
      } else {
        req.validated.old_tgl_selesai = checkById[0].tgl_selesai;
        next();
      }
    } catch (error) {
      console.log(error, "<<<<<< error");
    }
  }
  async delete(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const schema = joi.object({
        id: joi.number().required(),
      });

      const { value, error } = schema.validate(req.params);
      if (error) {
        return response(res, false, null, error.message, 400);
      }
      const checkById = await Service.get(value.id);
      if (checkById.length < 1)
        return response(res, false, null, "Periode not found", 404);

      req.validated = value;
      req.validated.old_tgl_selesai = checkById[0].tgl_selesai;

      next();
    } catch (error) {
      console.log(error, "<<<<<< error");
    }
  }
}

export default new Periode();
