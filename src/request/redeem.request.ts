import {NextFunction, Request, Response} from "express";
import joi from "joi";

export class RedeemRequest {
  authorize(req: Request, res: Response, next: NextFunction) {
    const schema = joi
        .object({
          transactions: joi.array().items(joi.string()).min(1).required(),
        })
        .unknown(false);

    const {value, error} = schema.validate(req.body);

    if (error) {
      return res
          .status(422)
          .json({value, message: error.message, errors: error.details});
    }

    next();
  }
}
