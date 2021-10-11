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
      let point = await Service.getPoint(req);
      let pointRedeem = await Service.getPointRedeem(req);
      let result = NumberFormat(
        { ...point[0], ...pointRedeem[0] },
        false,
        "achieve",
        "redeem"
      );
      result = {
        ...result,
        percentage: ((result.redeem / result.achieve) * 100).toFixed(2) + "%",
        percen: parseFloat(((result.redeem / result.achieve) * 100).toFixed(2)),
      };
	  return response(res, true, result, null, 200);
    //   let point = await Service.getPointSummary(req);
    //   point = point.map((e: any) => ({
    //       ...e,
    //       achieve: +e.achieve,
    //       redeem: +e.redeem,
    //       percentage: ((+e.redeem / e.achieve) * 100).toFixed(2) + '%',
    //       percen: parseFloat(((+e.redeem / e.achieve) * 100).toFixed(2)),
    //   }))
    //   point = NumberFormat(point, false, 'achieve', 'redeem');
    //   return response(res, true, point[0], null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
}
// result redeem tidak sama, karna join ke outlet
export default new Redeem();
