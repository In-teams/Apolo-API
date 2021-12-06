import { NextFunction, Request, Response } from "express";
import joi from "joi";
import App from "../helpers/App";
import response from "../helpers/Response";

class Report {
  get(req: Request, res: Response, next: NextFunction): any {
    const monthsId = App.months.map((e: any) => e.id);
    const schema = joi.object({
      show: joi.number().valid(10, 15),
      page: joi.number(),
      month: joi.number().valid(...monthsId),
      region_id: joi.string(),
      area_id: joi.string(),
      wilayah_id: joi.string(),
      outlet_id: joi.string(),
      distributor_id: joi.string(),
      ass_id: joi.string(),
      asm_id: joi.string(),
    });

    const { value, error } = schema.validate({ ...req.query, ...req.body });
    if (error) {
      return response(res, false, null, error.message, 400);
    }
    req.validated = value;
    next();
  }
}

export default new Report();
