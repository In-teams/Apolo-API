import { NextFunction, Request, Response } from "express";
import joi from "joi";
import { pathRedeem } from "../config/app";
import FileSystem from "../helpers/FileSystem";
import GetFileExtention from "../helpers/GetFileExtention";
import response from "../helpers/Response";
import service from "../services/Redeem";

class Redeem {
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
    try {
      const schema = joi.object({
        file: joi.string().base64().required(),
        outlet_id: joi.string().required(),
      });

      const { value, error } = schema.validate(req.body);
      if (error) {
        req.log(req, true, `Validation Error [400] : ${error.message}`);
        return response(res, false, null, error.message, 400);
      }

      req.validated = value;
      const ext = GetFileExtention(value.file);
      const filename: string = `${Date.now()}-${value.outlet_id}${ext}`;
      const path: string = pathRedeem + "/" + filename;
      const wasUploaded: any[] = await service.getRedeemForm(req);
      req.validated = { ...value, filename };
      if (wasUploaded.length > 0) {
        const { status_penukaran: status, filename: file, id } = wasUploaded[0];
        if (status === 7 || status === 8) {
          return response(
            res,
            false,
            null,
            "Redeemption form was uploaded",
            400
          );
        } else {
          await FileSystem.DeleteFile(`${pathRedeem}/${file}`);
          await FileSystem.WriteFile(path, value.file, true);
          req.validated.id = id;
          delete req.validated.file;
          await service.update(req);
          return response(
            res,
            true,
            "Redeem form has been replaced",
            null,
            200
          );
        }
      }
      await FileSystem.WriteFile(path, value.file, true);

      next();
    } catch (error) {
      console.log(error);
    }
  }
}

export default new Redeem();
