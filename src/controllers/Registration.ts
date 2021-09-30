import { Request, Response } from "express";
import DateFormat from "../helpers/DateFormat";
// import FileSystem from "../helpers/FileSystem";
import response from "../helpers/Response";
import Service from "../services/Registration";

class Registration {
  async post(req: Request, res: Response): Promise<object | undefined> {
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
      const total = regist.reduce((prev, curr) => prev + curr.total, 0)
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
      regist = DateFormat.index(regist, "register_at")
      return response(res, true, regist, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
}

export default new Registration();
