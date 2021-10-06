import { Request, Response } from "express";
import db from "../config/db";
import DateFormat from "../helpers/DateFormat";
import FileSystem from "../helpers/FileSystem";
import RegistrationHelper from "../helpers/RegistrationHelper";
import response from "../helpers/Response";
import Service from "../services/Registration";

class Registration {
  async getFile(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data = await Service.getRegistrationFile(req);
      data = data.map((e: any) => ({
        ...e,
        filename: `${req.protocol}://${req.headers.host}/file/registration/${e.filename}`,
        ext: e.filename.split(/[#?]/)[0].split('.').pop().trim()
      }))
      data = DateFormat.index(
        data,
        "DD MMMM YYYY HH:mm:ss",
        "tgl_upload",
        "validated_at"
      );
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async getRegistrationStatus(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data = await Service.getRegistrationStatus(req);
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async getOutletData(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data = await Service.getOutletData(req);
      return response(res, true, data[0], null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async getHistory(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data = await Service.getRegistrationHistory(req);
      data = DateFormat.index(data, "DD MMMM YYYY HH:mm:ss", "created_at");
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async post(req: Request, res: Response): Promise<object | undefined> {
    const transaction = await db.transaction();
    try {
      await Service.insertRegistrationForm(req, transaction);
      transaction.commit();
      return response(res, true, "Form successfully uploaded", null, 200);
    } catch (error) {
      FileSystem.DeleteFile(req.validated.path);
      console.log(error);
      transaction.rollback();
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async update(req: Request, res: Response): Promise<object | undefined> {
    const transaction = await db.transaction();
    try {
      await Service.updateOutletData(req, transaction);
      transaction.commit();
      return response(res, true, "Data successfully updated", null, 200);
    } catch (error) {
      FileSystem.DeleteFile(req.validated.path);
      console.log(error);
      transaction.rollback();
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async validation(req: Request, res: Response): Promise<object | undefined> {
    const transaction = await db.transaction();
    try {
      await Service.validation(req, transaction);
      transaction.commit();
      return response(res, true, "Form successfully validated", null, 200);
    } catch (error) {
      console.log(error);
      transaction.rollback();
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      const regist: any[] = await Service.getRegistrationSummary(req);
      const { total, total_outlet } = regist[0];
      const result: object = {
        regist: regist[0].total,
        percentage: ((total / total_outlet) * 100).toFixed(2) + "%",
        percen: parseFloat(((total / total_outlet) * 100).toFixed(2)),
        notregist: total_outlet - total,
        totalOutlet: total_outlet,
      };
      return response(res, true, result, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async getRegistrationSummaryByHR(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let regist: any[] = await Service.getRegistrationSummaryByHR(req);
      regist = RegistrationHelper(regist, "wilayah");
      return response(res, true, regist, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async getRegistrationSummaryByRegion(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let regist: any[] = await Service.getRegistrationSummaryByRegion(req);
      regist = RegistrationHelper(regist, "region");
      return response(res, true, regist, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async getRegistrationSummaryByArea(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let regist: any[] = await Service.getRegistrationSummaryByArea(req);
      regist = RegistrationHelper(regist, "area");
      return response(res, true, regist, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async getRegistrationSummaryByDistributor(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let regist: any[] = await Service.getRegistrationSummaryByDistributor(
        req
      );
      regist = RegistrationHelper(regist, "distributor");
      return response(res, true, regist, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async getRegistrationSummaryByOutlet(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let regist: any[] = await Service.getRegistrationSummaryByOutlet(req);
      regist = RegistrationHelper(regist, "outlet");
      return response(res, true, regist, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async getLastRegistration(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let regist: any[] = await Service.getLastRegistration(req);
      regist = DateFormat.index(regist, "register_at");
      return response(res, true, regist, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
}

export default new Registration();
