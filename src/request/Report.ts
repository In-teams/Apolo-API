import { NextFunction, Request, Response } from "express";
import joi from "joi";
import App from "../helpers/App";
import response from "../helpers/Response";

class Report {
  get(req: Request, res: Response, next: NextFunction): any {
    const monthsId = App.months.map((e: any) => e.id)
    const schema = joi.object({
        show: joi.number().valid(10, 15),
        page: joi.number(),
        month: joi.number().valid(...monthsId),
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
