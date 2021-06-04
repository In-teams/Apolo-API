import joi from "joi";
import { Request, Response, NextFunction } from "express";
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
        req.log(
          req,
          true,
          `Post Data Validation Error [400] : ${error.message}`
        );
        return response(res, false, null, error.message, 400);
      }

      req.validated = {
        ...value,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      const cekData = await Service.get(req);
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
}

export default new Periode();
