import { NextFunction, Request, Response } from "express";
import joi from "joi";
import GetFileExtention from "../helpers/GetFileExtention";
import response from "../helpers/Response";

class Auth {
  get(req: Request, res: Response, next: NextFunction): any {
    const schema = joi.object({
      region_id: joi.string(),
      area_id: joi.string(),
      wilayah_id: joi.string(),
      outlet_id: joi.string(),
      distributor_id: joi.string(),
      ass_id: joi.string(),
      asm_id: joi.string(),
      salesman_id: joi.string(),
      sort: joi.string(),
    });

    const { value, error } = schema.validate(req.query);
    if (error) {
      req.log(req, true, `Validation Error [400] : ${error.message}`);
      return response(res, false, null, error.message, 400);
    }
    req.validated = { ...value, sort: value.sort || "ASC" };
    next();
  }
  post(req: Request, res: Response, next: NextFunction): any {
    const schema = joi.object({
      file: joi.string().base64().required(),
      outlet_id: joi.string().required(),
      type_file: joi.number().required(),
    });

    const { value, error } = schema.validate(req.body);
    if (error) {
      req.log(req, true, `Validation Error [400] : ${error.message}`);
      return response(res, false, null, error.message, 400);
    }
    console.log(GetFileExtention(value.file));
    req.validated = value;
    next();
  }
}

export default new Auth();
