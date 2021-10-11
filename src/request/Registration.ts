import { NextFunction, Request, Response } from "express";
import joi from "joi";
import config from "../config/app";
import DateFormat from "../helpers/DateFormat";
import FileSystem from "../helpers/FileSystem";
import GetFileExtention from "../helpers/GetFileExtention";
import response from "../helpers/Response";
import Outlet from "../services/Outlet";
import PeriodeService from "../services/Periode";
import RegistrationService from "../services/Registration";
import appHelper from "../helpers/App";

class Registration {
  getHistory(req: Request, res: Response, next: NextFunction): any {
    const schema = joi.object({
      file_id: joi.number().required(),
    });

    const { value, error } = schema.validate(req.params);
    if (error) {
      return response(res, false, null, error.message, 400);
    }
    req.validated = value;
    next();
  }
  getFile(req: Request, res: Response, next: NextFunction): any {
    const schema = joi.object({
      outlet_id: joi.string().required(),
    });

    const { value, error } = schema.validate(req.params);
    if (error) {
      return response(res, false, null, error.message, 400);
    }
    req.validated = value;
    next();
  }
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
    let quarter: string[] | undefined = value.quarter_id
      ? appHelper.getMonthIdByQuarter(value.quarter_id)
      : undefined;
    req.validated = {
      ...value,
      sort: value.sort || "ASC",
      quarter: value.quarter_id,
      month: appHelper.getMonthName(value.month),
      month_id: value.month,
      ...(value.quarter_id && { quarter_id: quarter }),
    };
    next();
  }
  getOutletData(req: Request, res: Response, next: NextFunction): any {
    const schema = joi.object({
      outlet_id: joi.string(),
    });

    const { value, error } = schema.validate(req.params);
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

      req.body = {
        ...req.body,
        file: req.body.file.replace("data:", "").replace(/^.+,/, ""),
      };

      const { value, error } = schema.validate(req.body);
      if (error) {
        return response(res, false, null, error.message, 400);
      }

      req.validated = value;
      const outletCheck = await Outlet.getOutlet(req);
      if (outletCheck.length < 1)
        return response(res, false, null, "outlet id not found", 404);
      const check = await PeriodeService.checkData(req);
      if (check.length < 1)
        return response(res, false, null, "bukan periode upload", 400);
      const ext = GetFileExtention(value.file);
      if (!ext)
        return response(
          res,
          false,
          null,
          "only pdf and image extention will be allowed",
          400
        );
      let { periode, id: periode_id } = check[0];
      periode = `p-${periode_id}`;
      const filename = `f-${periode}-${Date.now()}-${value.outlet_id}${ext}`;
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
        const { level } = uploaded[0];
        if (level === "Level 4") {
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
          await FileSystem.WriteFile(path, value.file, true, ext);
          req.validated.id = id;
          await RegistrationService.updateRegistrationForm(req);
          return response(res, true, "Form successfully uploaded", null, 200);
        }
      }
      await FileSystem.WriteFile(path, value.file, true, ext);
      next();
    } catch (error) {
      // FileSystem.DeleteFile(req.validated.path)
      return response(res, false, null, error, 400);
    }
  }
  async update(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const schema = joi.object({
        outlet_id: joi.string().required(),
        type: joi.string().valid("ektp", "npwp").required(),
        nama: joi.string().required(),
        ...(req.body.type === "ektp"
          ? {
              no_ektp: joi.string().min(16).max(16).required(),
              ektp_file: joi.string().base64().required(),
            }
          : {
              no_npwp: joi.string().min(15).max(15).required(),
              npwp_file: joi.string().base64().required(),
            }),
        bank_file: joi.string().base64().required(),
        no_hp: joi.string().min(11).max(13).required(),
        alamat: joi.string().required(),
        rtrw: joi.string().required(),
        kode_pos: joi.string().min(5).max(5).required(),
        provinsi: joi.string().required(),
        kabupaten: joi.string().required(),
        kecamatan: joi.string().required(),
        kelurahan: joi.string().required(),
        jenis_badan: joi.string(),
      });

      const { value, error } = schema.validate({ ...req.body, ...req.params });
      if (error) {
        return response(res, false, null, error.message, 400);
      }

      req.validated = value;
      const outletCheck = await Outlet.getOutlet(req);
      if (outletCheck.length < 1)
        return response(res, false, null, "outlet id not found", 404);
      const check = await PeriodeService.checkData(req);
      if (check.length < 1)
        return response(res, false, null, "bukan periode upload", 400);
      const extFile = GetFileExtention(value[`${req.body.type}_file`]);
      const extBank = GetFileExtention(value.bank_file);
      if (!extFile || !extBank)
        return response(
          res,
          false,
          null,
          "only pdf and image extention will be allowed",
          400
        );
      let { periode, id: periode_id } = check[0];
      req.validated.periode_id = periode_id;
      const uploaded = await RegistrationService.getRegistrationForm(req);
      if (uploaded.length < 1)
        return response(
          res,
          false,
          null,
          "please upload registration form!",
          400
        );
      periode = `p-${periode_id}`;
      const IdType = req.body.type === "npwp" ? "n" : "e";
      const file = `${IdType}-${periode}-${Date.now()}-${
        value.outlet_id
      }${extFile}`;
      const bank = `b-${periode}-${Date.now()}-${value.outlet_id}${extBank}`;
      const bankFile = await RegistrationService.getRegistrationForm(req, 3);
      if (bankFile.length > 0) {
        const { filename, id } = bankFile[0];
        await RegistrationService.deleteRegistrationFile(id);
        await FileSystem.DeleteFile(`${config.pathRegistration}/${filename}`);
      }
      const FileId = await RegistrationService.getRegistrationForm(
        req,
        value.type === "npwp" ? 2 : 1
      );
      if (FileId.length > 0) {
        const { filename, id } = FileId[0];
        await RegistrationService.deleteRegistrationFile(id);
        await FileSystem.DeleteFile(`${config.pathRegistration}/${filename}`);
      }
      await FileSystem.WriteFile(
        config.pathRegistration + "/" + bank,
        value.bank_file,
        true,
        extBank
      );
      await FileSystem.WriteFile(
        config.pathRegistration + "/" + file,
        value[`${req.body.type}_file`],
        true,
        extFile
      );
      delete value.bank_file;
      delete value[`${req.body.type}_file`];

      req.validated = {
        ...value,
        [value.type]: file,
        bank,
        tgl_upload: DateFormat.getToday("YYYY-MM-DD HH:mm:ss"),
      };
      next();
    } catch (error) {
      console.log(error);
      // FileSystem.DeleteFile(req.validated.path)
      return response(res, false, null, error, 400);
    }
  }
  async validation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const schema = joi.object({
        status_registrasi: joi.number().required(),
        file_id: joi.number().required(),
        outlet_id: joi.string().required(),
      });

      const { value, error } = schema.validate(req.body);
      if (error) {
        return response(res, false, null, error.message, 400);
      }

      req.validated = {
        ...value,
        validated_at: DateFormat.getToday("YYYY-MM-DD HH:mm:ss"),
      };
      const isUploaded = await RegistrationService.getRegistrationForm(req);
      if (isUploaded.length < 1)
        return response(res, false, null, "registration is not uploaded", 400);
      const { level } = isUploaded[0];
      if (level === "Level 4")
        return response(res, false, null, "registration was validated", 400);
      next();
    } catch (error) {
      return response(res, false, null, error, 400);
    }
  }
}

export default new Registration();
