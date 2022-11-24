import {NextFunction, Request, Response} from "express";
import joi from "joi";
import response from "../helpers/Response";

class Auth {
  get(req: Request, res: Response, next: NextFunction): any {
    const schema = joi.object({
      quarter_id: joi.number().valid(1, 2, 3, 4),
      month: joi.number().valid(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12),
    });

    const { value, error } = schema.validate(req.query);
    if (error) {
      return response(res, false, null, error.message, 400);
    }
    req.validated = value;
    next();
  }
}

export default new Auth();
