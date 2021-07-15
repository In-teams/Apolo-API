import { NextFunction, Request, Response } from "express";
import joi from "joi";
import response from "../helpers/Response";

class Auth {
  get(req: Request, res: Response, next: NextFunction): any {
    const schema = joi.object({
      region_id: joi.string(),
      area_id: joi.string(),
      distributor_id: joi.string(),
      wilayah_id: joi.string(),
      outlet_id: joi.string(),
      ass_id: joi.string(),
      asm_id: joi.string(),
      salesman_id: joi.string(),
    });

    const { value, error } = schema.validate(req.query);
    if (error) {
      return response(res, false, null, error.message, 400);
    }
    req.validated = value
    next();
  }
}

export default new Auth();
