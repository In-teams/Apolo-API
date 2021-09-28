import { Request, Response } from "express";
// import FileSystem from "../helpers/FileSystem";
import response from "../helpers/Response";
import Service from "../services/Registration";

class Registration {
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
  async getRegistrationSummary(req: Request, res: Response): Promise<object | undefined> {
    try {
      const regist: any[] = await Service.getRegistrationSummaryByHR(req);
      // const { total, total_outlet } = regist[0];
      // const result: object = {
      //   regist: regist[0].total,
      //   percentage: ((total / total_outlet) * 100).toFixed(2) + "%",
      //   percen: parseFloat(((total / total_outlet) * 100).toFixed(2)),
      //   notregist: total_outlet - total,
      //   totalOutlet: total_outlet,
      // };
      return response(res, true, regist, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
}

export default new Registration();
