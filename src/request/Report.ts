import { NextFunction, Request, Response } from "express";
import joi from "joi";
import App from "../helpers/App";
import response from "../helpers/Response";

class Report {
  get(req: Request, res: Response, next: NextFunction): any {
    let status_registrasi = [];
    for (let i = 1; i <= 13; i++) {
      status_registrasi.push(i);
    }
    const monthsId = App.months.map((e: any) => e.id);
    const quartersId = App.quarters.map((e: any) => e.id);
    const schema = joi.object({
      show: joi.number().valid(10, 15),
      page: joi.number(),
      level: joi.number().valid(1, 2, 3, 4),
      month: joi.number().valid(...monthsId),
      quarter_id: joi.number().valid(...quartersId),
      region_id: joi.string(),
      area_id: joi.string(),
      wilayah_id: joi.string(),
      outlet_id: joi.string(),
      distributor_id: joi.string(),
      ass_id: joi.string(),
      status_terima: joi.number().valid(1, 2, 3, 4),
      status_registrasi: joi.number().valid(...status_registrasi),
      status_redeem: joi.number().valid(...status_registrasi),
      asm_id: joi.string(),
      order: joi
        .string()
        .valid("outlet_id", "outlet_name", "status", "type", "level"),
      sort: joi.string().valid("asc", "desc"),
    });

    const { value, error } = schema.validate({ ...req.query, ...req.body });
    if (error) {
      return response(res, false, null, error.message, 400);
    }
    let quarter: string[] | undefined = value.quarter_id
      ? App.getMonthIdByQuarter(value.quarter_id)
      : undefined;
    req.validated = {
      ...value,
      quarter: value.quarter_id,
      ...(value.quarter_id && { quarter_id: quarter }),
    };
    next();
  }
}

export default new Report();
