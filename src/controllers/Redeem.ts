import { Request, Response } from "express";
import NumberFormat from "../helpers/NumberFormat";
import response from "../helpers/Response";
import Service from "../services/Redeem";
import Wilayah from "../services/Wilayah";

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
  async getPointSummaryByHR(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let { sort } = req.validated;
      const point: any[] = await Service.getPointByHR(req);
      const pointRedeem: any[] = await Service.getPointRedeemByHR(req);
      let hr: any[] = await Wilayah.get(req);
      hr = hr
        .map((e: any) => {
          const achieve = parseFloat(
            point.find((p: any) => p.head_region_id === e.head_region_id)
              ?.achieve || 0
          );
          const redeem = parseFloat(
            pointRedeem.find((p: any) => p.head_region_id === e.head_region_id)
              ?.redeem || 0
          );
          return {
            ...e,
            achieve: achieve,
            redeem: redeem,
            diff: parseFloat((achieve - redeem).toFixed(2)),
            percentage: parseFloat(((redeem / achieve) * 100).toFixed(2)),
            pencapaian: ((redeem / achieve) * 100).toFixed(2) + "%",
          };
        })
        .sort((a, b) =>
          a.percentage > b.percentage
            ? sort.toUpperCase() === "DESC"
              ? -1
              : 1
            : sort.toUpperCase() === "DESC"
            ? 1
            : -1
        );
      return response(res, true, hr, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
}
// result redeem tidak sama, karna join ke outlet
export default new Redeem();
