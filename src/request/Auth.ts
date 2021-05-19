import { NextFunction, Request, Response } from "express";
import joi from "joi";
import { pathExcel } from "../config/app";
import fs from "../helpers/FileSystem";

class Auth {
  login(req: Request, res: Response, next: NextFunction): any {
    const schema = joi.object({
      username: joi.string().required(),
      password: joi.string().required(),
    });

    const { value, error } = schema.validate(req.body);
    if (error) {
      req.log(true, `Login Validation Error [400] : ${error.message}`);
      return res.status(400).send({ error: true, msg: error.message });
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
        req.log(
          true,
          `Register By Import Excel Validation Error [400] : ${error.message}`
        );
        return res.status(400).send({ error: true, msg: error.message });
      }

      const path: string = `${pathExcel}/${Date.now()}.xlsx`;
      await fs.WriteFile(path, req.body.file, true);
      let data = await fs.ReadExcelFile(path);
      let row: any[] = [];
      let resp: any[] = [];
      data.map((x: any[]) => {
        let password: string = "password " + x[1]; // password hash
        row.push(x[0], password);
        resp.push(row);
        row = [];
      });

      req.validated = resp;
      await fs.DeleteFile(path);
      next();
    } catch (error) {
      console.log(error);
    }
  }
}

export default new Auth();
