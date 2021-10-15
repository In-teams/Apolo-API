import { Request, Response } from "express";
import NumberFormat from "../helpers/NumberFormat";
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
  async getPointSummaryByRegion(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let { sort } = req.validated;
      const point: any[] = await Service.getPointByRegion(req);
      const pointRedeem: any[] = await Service.getPointRedeemByRegion(req);
      let region: any[] = await Region.get(req);
      region = region
        .map((e: any) => {
          const achieve = parseFloat(
            point.find((p: any) => p.pulau_id_alias === e.region_id)
              ?.achieve || 0
          );
          const redeem = parseFloat(
            pointRedeem.find((p: any) => p.pulau_id_alias === e.region_id)
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
        ).slice(0,5);
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
      area = area
        .map((e: any) => {
          const achieve = parseFloat(
            point.find((p: any) => p.city_id_alias === e.area_id)
              ?.achieve || 0
          );
          const redeem = parseFloat(
            pointRedeem.find((p: any) => p.city_id_alias === e.area_id)
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
        ).slice(0,5);
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
      let { sort } = req.validated;
      const point: any[] = await Service.getPointByDistributor(req);
      const pointRedeem: any[] = await Service.getPointRedeemByDistributor(req);
      let distributor: any[] = await Distributor.get(req);
      distributor = distributor
        .map((e: any) => {
          const achieve = parseFloat(
            point.find((p: any) => p.distributor_id === e.distributor_id)
              ?.achieve || 0
          );
          const redeem = parseFloat(
            pointRedeem.find((p: any) => p.distributor_id === e.distributor_id)
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
        ).slice(0,5);
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
      let { sort } = req.validated;
      const point: any[] = await Service.getPointByOutlet(req);
      const pointRedeem: any[] = await Service.getPointRedeemByOutlet(req);
      let outlet: any[] = await Outlet.get(req);
      outlet = outlet
        .map((e: any) => {
          const achieve = parseFloat(
            point.find((p: any) => p.outlet_id === e.outlet_id)
              ?.achieve || 0
          );
          const redeem = parseFloat(
            pointRedeem.find((p: any) => p.outlet_id === e.outlet_id)
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
        ).slice(0,5);
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
      let { sort } = req.validated;
      const point: any[] = await Service.getPointByASM(req);
      const pointRedeem: any[] = await Service.getPointRedeemByASM(req);
      let asm: any[] = await User.getAsm(req);
      asm = asm
        .map((e: any) => {
          const achieve = parseFloat(
            point.find((p: any) => p.asm_id === e.asm_id)
              ?.achieve || 0
          );
          const redeem = parseFloat(
            pointRedeem.find((p: any) => p.asm_id === e.asm_id)
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
        ).slice(0,5);
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
      ass = ass
        .map((e: any) => {
          const achieve = parseFloat(
            point.find((p: any) => p.ass_id === e.ass_id)
              ?.achieve || 0
          );
          const redeem = parseFloat(
            pointRedeem.find((p: any) => p.ass_id === e.ass_id)
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
        ).slice(0,5);
      return response(res, true, ass, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
}
// result redeem tidak sama, karna join ke outlet
export default new Redeem();
