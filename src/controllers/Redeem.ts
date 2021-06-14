import { Request, Response } from "express";
import NumberFormat from "../helpers/NumberFormat";
import response from "../helpers/Response";
import Service from "../services/Redeem";

class Redeem {
  async getPointSummary(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let point = await Service.getPointSummary(req);
      point = NumberFormat(point, false, "achieve", "redeem");
      req.log(req, false, "Success get Poin data [200]");
      return response(res, true, point[0], null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
  async getPointSummaryByHR(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let point : any[1] = await Service.getPointSummaryByHR(req);
      point = point.map((val:any) => ({
        ...val,
        diff: val.achieve - val.redeem,
        percentage: ((val.redeem / val.achieve) * 100).toFixed(2) + "%"
      }))
      point = NumberFormat(point, false, "achieve", "redeem", "diff");
      req.log(req, false, "Success get Poin data [200]");
      return response(res, true, point, null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
}
// result redeem tidak sama, karna join ke outlet
export default new Redeem();
