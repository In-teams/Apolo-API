import cryptoRandomString from "crypto-random-string";
import { NextFunction, Request, Response } from "express";
import joi from "joi";
import config from "../config/app";
import db from "../config/db";
import appHelper from "../helpers/App";
import DateFormat from "../helpers/DateFormat";
import FileSystem from "../helpers/FileSystem";
import GetFileExtention from "../helpers/GetFileExtention";
import response from "../helpers/Response";
import Outlet from "../services/Outlet";
import Periode from "../services/Periode";
import service from "../services/Redeem";
import Registration from "../services/Registration";

class Redeem {
  getProduct(req: Request, res: Response, next: NextFunction): any {
    const schema = joi.object({
      outlet_id: joi.string().required(),
      category: joi.string(),
    });

    const { value, error } = schema.validate(req.query);
    if (error) {
      return response(res, false, null, error.message, 400);
    }
    req.validated = value;
    next();
  }
  async getRedeemFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const schema = joi.object({
      outlet_id: joi.string().required(),
    });

    const { value, error } = schema.validate(req.params);
    if (error) {
      return response(res, false, null, error.message, 400);
    }
    req.validated = value;
    const outletCheck = await Outlet.getOutlet(req);
    if (outletCheck.length < 1)
      return response(res, false, null, "outlet not found", 404);
    next();
  }
  async getRedeemHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const schema = joi.object({
      file_id: joi.number().required(),
      category: joi.string(),
    });

    const { value, error } = schema.validate({ ...req.params, ...req.query });
    if (error) {
      return response(res, false, null, error.message, 400);
    }
    req.validated = value;
    const fileCheck = await service.getRedeemFileByFileId(req.validated);
    if (!fileCheck) return response(res, false, null, "file not found", 404);
    // const outletCheck = await Outlet.getOutlet(req);
    // if (outletCheck.length < 1)
    //   return response(res, false, null, "outlet not found", 404);
    req.validated.file = fileCheck.filename;
    next();
  }
  async getTransactionDetail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const schema = joi.object({
      file_id: joi.number().required(),
      kd_transaksi: joi.string().required(),
    });

    const { value, error } = schema.validate(req.params);
    if (error) {
      return response(res, false, null, error.message, 400);
    }
    req.validated = value;
    const fileCheck = await service.getRedeemFileByFileId(req.validated);
    if (!fileCheck) return response(res, false, null, "file not found", 404);
    const transactionCodeCheck = await service.getTransactionCode(
      value.kd_transaksi
    );
    if (!transactionCodeCheck)
      return response(res, false, null, "kd transaksi not found", 404);
    req.validated.filename = fileCheck.filename;
    next();
  }
  async getHistoryRedeemFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const schema = joi.object({
      file_id: joi.string().required(),
      outlet_id: joi.string().required(),
    });

    const { value, error } = schema.validate({ ...req.params, ...req.query });
    if (error) {
      return response(res, false, null, error.message, 400);
    }
    req.validated = value;
    const isUploaded = await service.getRedeemFileById(req);
    if (!isUploaded) return response(res, false, null, "file not found", 404);
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
      sort: joi.string(),
      quarter_id: joi.number().valid(1, 2, 3, 4),
      sem: joi.number().valid(1, 2),
      month: joi.number().valid(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12),
    });

    const { value, error } = schema.validate(req.query);
    if (error) {
      return response(res, false, null, error.message, 400);
    }

    let quarter: number[] | undefined = value.quarter_id
      ? appHelper.getMonthIdByQuarter(value.quarter_id)
      : undefined;
    let semester: number[] | undefined = value.sem
      ? appHelper.getMonthIdBySemester(value.sem)
      : undefined;
    req.validated = {
      ...value,
      sort: value.sort || "ASC",
      quarter: value.quarter_id,
      month: appHelper.getMonthName(value.month),
      month_id: value.month,
      ...(value.sem && { semester_id: semester }),
      ...(value.quarter_id && { quarter_id: quarter }),
    };
    next();
  }
  async checkout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // const isPulsaOrEwallet = async (product: string) => {
      //   const check = await service.getProductCategoryByProduct(product);
      // };
      const check = await service.getProductCategoryByProduct(
        req.body?.product.map((e: any) => e.product_id)
      );
      const schema = joi.object({
        product: joi
          .array()
          .items(
            joi.object({
              product_id: joi.string().required(),
              quantity: joi.number().required(),
              ...((check.includes("PULSA") || check.includes("EWALLET")) && {
                no_handphone: joi.string().min(11).max(13),
              }),
            })
          )
          .required(),
        outlet_id: joi.string().required(),
        file_id: joi.number().required(),
      });

      const { value, error } = schema.validate(req.body);
      if (error) {
        return response(res, false, null, error.message, 400);
      }

      if (value.product.length < 1)
        return response(res, false, null, "must be value at least 1", 400);

      req.validated = value;
      const isRegis = await Outlet.outletIsRegist(value.outlet_id);
      if (!["Yes+", "Yes"].includes(isRegis))
        return response(res, false, null, "Belum registrasi", 400);
      const isUploaded = await service.getRedeemFileById(req);
      if (!isUploaded)
        return response(res, false, null, "Belum upload form redeem", 400);
      if (!["Level 4"].includes(isUploaded?.level))
        return response(
          res,
          false,
          null,
          "File belum tervalidasi success",
          400
        );
      // if (isUploaded[0].outlet_id === value.outlet_id)
      //   return response(res, false, null, "form unknown", 400);
      next();
    } catch (error) {
      console.log(error, "error request");
    }
  }
  async otorisasi(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const schema = joi.object({
        items: joi.array().items(joi.string()).required(),
      });

      const { value, error } = schema.validate(req.body);
      if (error) {
        return response(res, false, null, error.message, 400);
      }

      if (value.items.length < 1)
        return response(res, false, null, "must be value at least 1", 400);

      req.validated = value;
      next();
    } catch (error) {
      console.log(error, "error request");
    }
  }
  async purchaseReq(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const schema = joi.object({
        items: joi.array().items(joi.string()).required(),
      });

      const { value, error } = schema.validate(req.body);
      if (error) {
        return response(res, false, null, error.message, 400);
      }

      if (value.items.length < 1)
        return response(res, false, null, "must be value at least 1", 400);

      req.validated = value;
      next();
    } catch (error) {
      console.log(error, "error request");
    }
  }
  async validation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      let statusList: any[] = await service.getRedeemStatus();
      statusList = statusList.map((e: any) => e.id);
      const schema = joi.object({
        status_penukaran: joi
          .number()
          .valid(...statusList)
          .required(),
        outlet_id: joi.string().required(),
        file_id: joi.number().required(),
      });

      const { value, error } = schema.validate(req.body);
      if (error) {
        return response(res, false, null, error.message, 400);
      }

      req.validated = value;
      if (req.decoded.level !== "1")
        return response(res, false, null, "Access Denied", 403);
      // const isRegis = await Outlet.outletIsRegist(value.outlet_id);
      // if (!["Yes+", "Yes"].includes(isRegis))
      //   return response(res, false, null, "Belum registrasi", 400);
      const isUploaded = await service.getRedeemFileById(req);
      if (!isUploaded) return response(res, false, null, "file not found", 404);
      if (["Level 4"].includes(isUploaded?.level))
        return response(res, false, null, "File sudah tervalidasi", 400);
      req.validated = {
        ...req.validated,
        validated_at: DateFormat.getToday("YYYY-MM-DD HH:mm:ss"),
      };
      next();
    } catch (error) {
      console.log(error, "error request");
    }
  }
  async post(req: Request, res: Response, next: NextFunction): Promise<any> {
    const t = await db.transaction();
    try {
      const schema = joi.object({
        file: joi.string().base64().required(),
        outlet_id: joi.string().required(),
      });

      req.body = {
        ...req.body,
        file: req.body.file?.replace("data:", "").replace(/^.+,/, ""),
      };

      const { value, error } = schema.validate(req.body);
      if (error) {
        return response(res, false, null, error.message, 400);
      }
      req.validated = value;

      const outletCheck = await Outlet.getOutlet(req);
      if (outletCheck.length < 1)
        return response(res, false, null, "outlet id not found", 404);
      const ext = GetFileExtention(value.file);
      if (!ext) {
        const msg = "only pdf and image extention will be allowed";
        return response(res, false, null, msg, 400);
      }

      // const isRegis = await Outlet.outletIsRegist(value.outlet_id);
      // if (!["Yes+", "Yes"].includes(isRegis))
      //   return response(res, false, null, "Belum registrasi", 400);

      const random = cryptoRandomString({ length: 10, type: "alphanumeric" });
      const filename = `${random}${ext}`;
      const path = config.pathRedeem + "/" + filename;
      const { level: levelUser } = req.decoded;

      await FileSystem.WriteFile(path, value.file, true, ext);
      req.validated.file = {
        outlet_id: value.outlet_id,
        filename,
        tgl_upload: DateFormat.getToday("YYYY-MM-DD HH:mm:ss"),
      };
      const isUploaded = await service.getRedeemFile(req);
      if (isUploaded.length > 0) {
        if (levelUser !== "1")
          return response(res, false, null, "Upload hanya bisa sekali", 400);
        await service.updateRedeemFile(
          { ...req.validated.file, ...req.decoded },
          t
        );
        t.commit();
        return response(res, true, "Form successfully uploaded", null, 200);
      }
      next();
    } catch (error) {
      t.rollback();
      console.log(error);
      // throw new Error(JSON.stringify(error));
    }
  }
}

export default new Redeem();
