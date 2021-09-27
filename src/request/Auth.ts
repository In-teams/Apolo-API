import { NextFunction, Request, Response } from "express";
import joi from "joi";
import response from "../helpers/Response";

class Auth {
  login(req: Request, res: Response, next: NextFunction): any {
    const schema = joi.object({
      username: joi.string().required(),
      password: joi.string().required(),
    });

    const { value, error } = schema.validate(req.body);
    if (error) {
      return response(res, false, null, error.message, 400);
    }

    req.validated = value;
    next();
  }

}

export default new Auth();
