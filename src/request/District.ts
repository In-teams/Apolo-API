import { NextFunction, Request, Response } from "express";
import joi from "joi";
import response from "../helpers/Response";

class District {
  get(req: Request, res: Response, next: NextFunction): any {
    const schema = joi.object({
      province_id: joi.string(),
      city_id: joi.string(),
      district_id: joi.string(),
      subdistrict_id: joi.string(),
    });

    const { value, error } = schema.validate(req.query);
    if (error) {
      return response(res, false, null, error.message, 400);
    }
    req.validated = value
    next();
  }
}

export default new District();
