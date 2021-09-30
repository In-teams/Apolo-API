import { Request, Response } from "express";
import db from "../config/db";
import DateFormat from "../helpers/DateFormat";
import FileSystem from "../helpers/FileSystem";
import response from "../helpers/Response";
import Service from "../services/Registration";

class Registration {
  async getFile(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data = await Service.getRegistrationFile(req);
      data = DateFormat.index(data, "DD MMMM YYYY HH:mm:ss", "tgl_upload", "validated_at")
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async getHistory(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data = await Service.getRegistrationHistory(req);
      data = DateFormat.index(data, "DD MMMM YYYY HH:mm:ss", "created_at")
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
      regist = regist.map((e: any) => ({
        ...e,
        total: e.regist + e.notregist,
        percentage: e.pencapaian + "%",
        pencapaian: parseFloat(e.pencapaian),
      }));
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
      regist = regist.map((e: any) => ({
        ...e,
        // total: e.regist + e.notregist,
        percentage: e.pencapaian + "%",
        pencapaian: parseFloat(e.pencapaian),
      }));
      const total = regist.reduce((prev, curr) => prev + curr.total, 0);
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
