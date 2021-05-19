import joi from "joi";
import { Request, Response, NextFunction } from "express";

class Auth {
  login(req: Request, res: Response, next: NextFunction): any {
    const schema = joi.object({
      username: joi.string().required(),
      password: joi.string().required(),
    });

    const { value, error } = schema.validate(req.body);
    if (error) {
      req.log(true, `Login Validation Error [400] : ${error.message}`)
      return res.status(400).send({ error: true, msg: error.message });
    }

    req.validated = value;
    next();
  }
}

export default new Auth();
