import { Request, Response } from "express";
import NumberFormat from "../helpers/NumberFormat";
import response from "../helpers/Response";
import Service from "../services/Sales";

class Sales {
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      let sales: any[1] = await Service.getSummary(req);
      sales = sales.map((val: any) => ({
        ...val,
        avg: val.aktual / val.total_outlet,
        diff:  val.target - val.aktual,
        percentage: ((val.aktual / val.target) * 100).toFixed(2) + " %",
      }));
      sales = NumberFormat(sales, true, "aktual", "target", "avg", "diff");
      return response(res, true, sales[0], null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }

  async getSummary(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data: any[1] = await Service.getSummaryByHR(req);
      data = NumberFormat(data, true, "aktual", "target");
      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
}

export default new Sales();
