import { genSaltSync, hashSync } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import joi from "joi";
import { pathExcel } from "../config/app";
import fs from "../helpers/FileSystem";
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

  async registerByImpExcel(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const schema = joi.object({
        file: joi.string().base64().required(),
      });

      const { value, error } = schema.validate(req.body);
      if (error) {
        return response(res, false, null, error.message, 400);
      }

      const path: string = `${pathExcel}/${Date.now()}.xlsx`;
      await fs.WriteFile(path, req.body.file, true);
      let data = await fs.ReadExcelFile(path);
      let row: any[] = [];
      let resp: any[] = [];
      let isError: boolean = false;
      data.map((x: any[]) => {
        if (!x[1]) isError = true;
        let password: string = hashSync(x[1].toString() || "", genSaltSync(1)); // password hash
        row.push(x[0], password);
        resp.push(row);
        row = [];
      });

      await fs.DeleteFile(path);
      if (isError) {
        return response(res, false, null, "Structure file is not allowed", 400);
      }

      req.validated = resp;
      next();
    } catch (error) {
      console.log(error);
    }
  }
}

export default new Auth();
