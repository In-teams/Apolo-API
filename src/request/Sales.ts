import { NextFunction, Request, Response } from "express";
import joi from "joi";
import response from "../helpers/Response";

class Auth {
  get(req: Request, res: Response, next: NextFunction): any {
    const schema = joi.object({
      page: joi.number(),
      show: joi.number(),
      quarter: joi.string(),
      year: joi.string(),
      month: joi.string(),
      wilayah_id: joi.string(),
      region_id: joi.string(),
      area_id: joi.string(),
      ass_id: joi.string(),
      asm_id: joi.string(),
      salesman_id: joi.string(),
      distributor_id: joi.string(),
      outlet_id: joi.string(),
    });

    const { value, error } = schema.validate(req.query);
    if (error) {
      req.log(req, true, `Validation Error [400] : ${error.message}`);
      return response(res, false, null, error.message, 400);
    }

    if(!isNaN(value.month)) return response(res, false, null, 'month just allowed string (monthname)', 400);
    const { page = 1, month = new Date().getMonth() + 1 } = value;
    req.validated = { ...value, page, month };
    next();
  }
}

export default new Auth();
