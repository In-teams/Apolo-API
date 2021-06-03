import { Request, Response } from "express";
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
        notregist: total_outlet - total,
        totalOutlet: total_outlet,
      };
      req.log(req, false, "Success get outlet data [200]");
      return response(res, true, result, null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
  async getLastRegistration(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const regist: any[] = await Service.getLastRegistration(req);
      req.log(req, false, "Success get outlet data [200]");
      return response(res, true, regist, null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
  async getRegistrationSummary(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let regist: any[] = await Service.getRegistationSummaryByHeadRegion(req);
      regist = regist.map((val: any) => ({
        ...val,
        total: val.regist + val.notregist,
        percentage:
          ((val.regist / (val.regist + val.notregist)) * 100).toFixed(2) + "%",
      }));

      req.log(req, false, "Success get outlet data [200]");
      return response(res, true, regist, null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
}

export default new Registration();
