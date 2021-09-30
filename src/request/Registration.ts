import { NextFunction, Request, Response } from "express";
import joi from "joi";
import config from "../config/app";
import FileSystem from "../helpers/FileSystem";
import GetFileExtention from "../helpers/GetFileExtention";
import response from "../helpers/Response";
import PeriodeService from "../services/Periode";
import OutletService from "../services/Outlet";
import RegistrationService from "../services/Registration";
import fs from "fs";
import DateFormat from "../helpers/DateFormat";

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
      quarter_id: joi.number().valid(1, 2, 3, 4),
      sort: joi.string(),
      month: joi.string(),
    });

    const { value, error } = schema.validate(req.query);
    if (error) {
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
        return response(res, false, null, error.message, 400);
      }

      req.validated = value;
      const check = await PeriodeService.checkData(req);
      if (check.length < 1)
        return response(res, false, null, "bukan periode upload", 400);
      const ext = GetFileExtention(value.file);
      let { periode, id: periode_id } = check[0];
      periode = `p-${periode.split(" ")[1]}`;
      const filename = `${periode}-${Date.now()}-${value.outlet_id}${ext}`;
      // const path = "/" + filename;
      const path = config.pathRegistration + "/" + filename;
      req.validated = {
        ...req.validated,
        filename,
        periode_id,
        path,
        tgl_upload: DateFormat.getToday("YYYY-MM-DD HH:mm:ss"),
      };
      delete req.validated.file;
      const uploaded = await RegistrationService.getRegistrationForm(req);
      if (uploaded.length > 0) {
        const { status_registrasi: status } = uploaded[0];
        if (status === 7 || status === 8) {
          return response(
            res,
            false,
            null,
            "Registration form was validated",
            400
          );
        } else {
          const { id, filename } = uploaded[0];
          await FileSystem.DeleteFile(`${config.pathRegistration}/${filename}`);
          await FileSystem.WriteFile(path, value.file, true);
          req.validated.id = id;
          await RegistrationService.updateRegistrationForm(req);
          return response(res, true, "Form successfully uploaded", null, 200);
        }
      }
      await FileSystem.WriteFile(path, value.file, true);
      next();
    } catch (error) {
      return response(res, false, null, JSON.stringify(error), 400);
    }
  }
  //   async validation(
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<any> {
  //     try {
  //       const schema = joi.object({
  //         status_registrasi: joi.number().required(),
  //         periode_id: joi.number().required(),
  //         outlet_id: joi.string().required(),
  //       });

  //       const { value, error } = schema.validate(req.body);
  //       if (error) {
  //         return response(res, false, null, error.message, 400);
  //       }

  //       req.validated = value;
  //       const isUploaded = await RegistrationService.getRegistrationForm(req);
  //       if (isUploaded.length < 1)
  //         return response(res, false, null, "registration is not uploaded", 400);
  //       const { status_registrasi: status } = isUploaded[0];
  //       if (status === 7 || status === 8)
  //         return response(res, false, null, "registration was validated", 400);
  //       next();
  //     } catch (error) {
  //       return response(res, false, null, JSON.stringify(error), 400)
  //     }
  //   }
}

export default new Registration();
