import joi from "joi";
import { Request, Response, NextFunction } from "express";

class Example {
  post(req: Request, res: Response, next: NextFunction): any {
    const schema = joi.object({
      name: joi.string().required(),
      isHandsome: joi.boolean(),
    });

    const { value, error } = schema.validate(req.body);
    if (error) {
      req.log(true, `Post Data Validation Error [400] : ${error.message}`)
      return res.status(400).send({ error: true, msg: error.message });
    }

    req.validated = value;
    next();
  }
}

export default new Example();
