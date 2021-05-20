import { NextFunction, Request, Response } from "express";
import joi from "joi";
import response from "../helpers/Response";

class Auth {
  getTarget(req: Request, res: Response, next: NextFunction): any {
    const schema = joi.object({
      page: joi.number(),
      show: joi.number(),
      quarter: joi.string(),
      year: joi.string(),
      month: joi.string(),
      wilayah: joi.string(),
      region: joi.string(),
      area: joi.string(),
      distributor: joi.string(),
      outlet: joi.string(),
    });

    const { value, error } = schema.validate(req.query);
    if (error) {
      req.log(true, `Validation Error [400] : ${error.message}`);
      return response(res, false, null, error.message, 400);
    }

    req.validated = value;
    next();
  }
}

export default new Auth();