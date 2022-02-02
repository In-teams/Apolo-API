import { Request, Response } from "express";
import response from "../helpers/Response";
import appHelper from "../helpers/App";
import service from "../services/App";

class App {
  async getBanks(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data: any[] = await service.getBanks();

      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getMonth(req: Request, res: Response): Promise<object | undefined> {
    try {
      interface month {
        id: number | null;
        month: string;
      }
      let data: month[] = appHelper.getMonth(req.validated.quarter_id);

      data = [{ id: null, month: "ALL" }, ...data];

      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getQuarter(req: Request, res: Response): Promise<object | undefined> {
    try {
      const month = req.validated.month || null;
      interface q {
        id: number | null;
        quarter: string;
      }
      let data: q[] = appHelper.getQuarter(month);

      data = [{ id: null, quarter: "ALL 1" }, ...data];

      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getYear(req: Request, res: Response): Promise<object | undefined> {
    try {
      const data: object[] = [
        { id: 1, year: new Date().getFullYear() - 1 },
        { id: 2, year: new Date().getFullYear() },
        { id: 3, year: new Date().getFullYear() + 1 },
      ];
      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
}

export default new App();
