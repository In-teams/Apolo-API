import { Request, Response } from "express";
import App from "../helpers/App";
import DateFormat from "../helpers/DateFormat";
import NumberFormat from "../helpers/NumberFormat";
import RedeemHelper from "../helpers/RedeemHelper";
import response from "../helpers/Response";
import Area from "../services/Area";
import Distributor from "../services/Distributor";
import Outlet from "../services/Outlet";
import Service from "../services/Redeem";
import Region from "../services/Region";
import User from "../services/User";
import Wilayah from "../services/Wilayah";

class Redeem {
  async getPointSummary(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let point = await Service.getPoint(req);
      let pointRedeem = await Service.getPointRedeem(req);
      let pointDiff = point[0].achieve - pointRedeem[0].redeem;
      let result = NumberFormat(
        { ...point[0], ...pointRedeem[0], diff: pointDiff },
        false,
        "achieve",
        "diff",
        "redeem"
      );
      result = {
        ...result,
        percentage: ((result.redeem / result.achieve) * 100).toFixed(2) + "%",
        percen: parseFloat(((result.redeem / result.achieve) * 100).toFixed(2)),
      };
      return response(res, true, result, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getLastRedeem(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let redeem = await Service.getRedeemLast(req);
      redeem = DateFormat.index(redeem, "DD MMMM YYYY", "tgl_transaksi");
      return response(res, true, redeem, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getPointSummaryByMonth(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const months = App.months;
      const point: any[] = await Service.getPointPerMonth(req);
      const pointRedeem: any[] = await Service.getPointRedeemPerMonth(req);
      let result = months.map((e: any) => ({
        ...e,
        achieve: point[e.id] || 0,
        redeem: pointRedeem[e.id] || 0,
        diff: parseFloat(point[e.id] || 0) - parseFloat(pointRedeem[e.id] || 0),
      }));
      result = NumberFormat(result, false, "achieve", "redeem", "diff");
      return response(res, true, result, null, 200);
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
      const point: any[] = await Service.getPointByHR(req);
      const pointRedeem: any[] = await Service.getPointRedeemByHR(req);
      let hr: any[] = await Wilayah.get(req);
      hr = RedeemHelper(
        hr,
        point,
        pointRedeem,
        req.validated,
        "head_region_id",
        "head_region_id"
      );
      return response(res, true, hr, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getPointSummaryByRegion(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const point: any[] = await Service.getPointByRegion(req);
      const pointRedeem: any[] = await Service.getPointRedeemByRegion(req);
      let region: any[] = await Region.get(req);
      region = RedeemHelper(
        region,
        point,
        pointRedeem,
        req.validated,
        "pulau_id_alias",
        "region_id"
      );
      return response(res, true, region, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getPointSummaryByArea(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let { sort } = req.validated;
      const point: any[] = await Service.getPointByArea(req);
      const pointRedeem: any[] = await Service.getPointRedeemByArea(req);
      let area: any[] = await Area.get(req);
      area = RedeemHelper(
        area,
        point,
        pointRedeem,
        req.validated,
        "city_id_alias",
        "area_id"
      );
      return response(res, true, area, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getPointSummaryByDistributor(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let point: any[] = await Service.getPointByDistributor(req);
      let pointRedeem: any[] = await Service.getPointRedeemByDistributor(req);
      let distributor: any[] = await Distributor.get(req);

      // const arrayToObject1 = (arr: any[], key: string, key2: string) => {
      //   return arr.reduce((obj: any, item: any) => {
      //       obj[item[key]] = item[key2]
      //       return obj
      //   }, {})
      // }

      // point = arrayToObject1(point, 'distributor_id', 'achieve')
      // pointRedeem = arrayToObject1(pointRedeem, 'distributor_id', 'redeem')

      // distributor = distributor.map((e: any) => ({
      //   ...e,
      //   achieve: point[e.distributor_id],
      //   redeem: pointRedeem[e.distributor_id]
      // }))
      distributor = RedeemHelper(
        distributor,
        point,
        pointRedeem,
        req.validated,
        "distributor_id",
        "distributor_id"
      );
      return response(res, true, distributor, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getPointSummaryByOutlet(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const point: any[] = await Service.getPointByOutlet(req);
      const pointRedeem: any[] = await Service.getPointRedeemByOutlet(req);
      let outlet: any[] = await Outlet.get(req);
      outlet = RedeemHelper(
        outlet,
        point,
        pointRedeem,
        req.validated,
        "outlet_id",
        "outlet_id"
      );
      return response(res, true, outlet, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getPointSummaryByASM(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const point: any[] = await Service.getPointByASM(req);
      const pointRedeem: any[] = await Service.getPointRedeemByASM(req);
      let asm: any[] = await User.getAsm(req);
      asm = RedeemHelper(
        asm,
        point,
        pointRedeem,
        req.validated,
        "asm_id",
        "asm_id"
      );
      return response(res, true, asm, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getPointSummaryByASS(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let { sort } = req.validated;
      const point: any[] = await Service.getPointByASS(req);
      const pointRedeem: any[] = await Service.getPointRedeemByASS(req);
      let ass: any[] = await User.getAss(req);
      ass = RedeemHelper(
        ass,
        point,
        pointRedeem,
        req.validated,
        "ass_id",
        "ass_id"
      );
      return response(res, true, ass, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
}
// result redeem tidak sama, karna join ke outlet
export default new Redeem();
