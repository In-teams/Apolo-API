import { NextFunction, Request, Response } from "express";
import joi from "joi";
import { pathRegistration } from "../config/app";
import FileSystem from "../helpers/FileSystem";
import GetFileExtention from "../helpers/GetFileExtention";
import response from "../helpers/Response";
import PeriodeService from "../services/Periode";

class Registration {
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
  async post(req: Request, res: Response, next: NextFunction): Promise<any> {
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

    req.validated = value;
    const check = await PeriodeService.checkData(req);
    if (check.length < 1)
      return response(res, false, null, "bukan periode upload", 400);
    const ext = GetFileExtention(value.file);
    const filename = 'p-' +check[0].periode.split(' ')[1] + Date.now() + ext
    const path = pathRegistration + "/" + filename;
    await FileSystem.WriteFile(path, value.file, true);
    next();
  }
}

export default new Registration();
