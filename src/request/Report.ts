import { NextFunction, Request, Response } from "express";
import joi from "joi";
import response from "../helpers/Response";

class Report {
  get(req: Request, res: Response, next: NextFunction): any {
    const schema = joi.object({
        show: joi.number().valid(10, 15),
        page: joi.number(),
    });

    const { value, error } = schema.validate({...req.query, ...req.body});
    if (error) {
      return response(res, false, null, error.message, 400);
    }
    req.validated = value
    next();
  }
}

export default new Report();
