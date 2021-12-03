import { Request, Response } from "express";
import _ from "lodash";
import NumberFormat from "../helpers/NumberFormat";
import response from "../helpers/Response";
import Outlet from "../services/Outlet";
import Service from "../services/Report";

const sumDataBy = (data: any[], key: string) => _.sumBy(data, (o) => o[key]);

class Report {
  async getRegistrationReport(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const outletCount = await Outlet.getOutletCount(req);
      const data = await Service.getRegistrationReport(req.validated);
      const show = req.validated.show || 10;
      const totalPage = Math.ceil(outletCount[0].total / show);
      return response(
        res,
        true,
        {
          totalPage,
          data,
        },
        null,
        200
      );
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getRedeemReport(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const outletCount = await Outlet.getOutletCount(req);
      const data = await Service.getRedeemReport(req.validated);
      const show = req.validated.show || 10;
      const totalPage = Math.ceil(outletCount[0].total / show);
      return response(
        res,
        true,
        {
          totalPage,
          data,
        },
        null,
        200
      );
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getPointActivityReport(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const data = await Service.getPointActivity(req.validated);
      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getRegistrationResumeReport(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any[] = await Service.getRegistrationResumeReport();
      const total = sumDataBy(data, "total");
      const level1 = sumDataBy(data, "level1");
      const level1percen =
        ((sumDataBy(data, "level1") / total) * 100).toFixed(2) + "%";
      const level2 = sumDataBy(data, "level2");
      const level2percen =
        ((sumDataBy(data, "level2") / total) * 100).toFixed(2) + "%";
      const level3 = sumDataBy(data, "level3");
      const level3percen =
        ((sumDataBy(data, "level3") / total) * 100).toFixed(2) + "%";
      const level4 = sumDataBy(data, "level4");
      const level4percen =
        ((sumDataBy(data, "level4") / total) * 100).toFixed(2) + "%";

      data = data.map((e: any) => ({
        ...e,
        level1percen: ((e.level1 / total) * 100).toFixed(2) + "%",
        level2percen: ((e.level2 / total) * 100).toFixed(2) + "%",
        level3percen: ((e.level3 / total) * 100).toFixed(2) + "%",
        level4percen: ((e.level4 / total) * 100).toFixed(2) + "%",
      }));
      data.push({
        type: "Total Outlet",
        level1,
        level2,
        level3,
        level4,
        level1percen,
        level2percen,
        level3percen,
        level4percen,
        total,
      });
      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getRedeemResumeReport(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any[] = await Service.getRedeemResumeReport();
      const total = sumDataBy(data, "total");
      const level1 = sumDataBy(data, "level1");
      const level1percen =
        ((sumDataBy(data, "level1") / total) * 100).toFixed(2) + "%";
      const level2 = sumDataBy(data, "level2");
      const level2percen =
        ((sumDataBy(data, "level2") / total) * 100).toFixed(2) + "%";
      const level3 = sumDataBy(data, "level3");
      const level3percen =
        ((sumDataBy(data, "level3") / total) * 100).toFixed(2) + "%";
      const level4 = sumDataBy(data, "level4");
      const level4percen =
        ((sumDataBy(data, "level4") / total) * 100).toFixed(2) + "%";

      data = data.map((e: any) => ({
        ...e,
        level1percen: ((e.level1 / total) * 100).toFixed(2) + "%",
        level2percen: ((e.level2 / total) * 100).toFixed(2) + "%",
        level3percen: ((e.level3 / total) * 100).toFixed(2) + "%",
        level4percen: ((e.level4 / total) * 100).toFixed(2) + "%",
      }));
      data.push({
        type: "Total Outlet",
        level1,
        level2,
        level3,
        level4,
        level1percen,
        level2percen,
        level3percen,
        level4percen,
        total,
      });
      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getSalesReportPerSubBrand(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any[] = await Service.getSalesReportPerSubBrand();
      const sumAktual = sumDataBy(data, "aktual");
      const sumHistorical = sumDataBy(data, "historical");
      const sumGap = sumDataBy(data, "gap");
      data = data.map((e: any) => ({
        ...e,
        bobot_historical:
          ((e.historical / sumHistorical) * 100).toFixed(2) + "%",
        bobot_aktual: ((e.aktual / sumAktual) * 100).toFixed(2) + "%",
        bobot_growth:
          (
            parseFloat(((e.aktual / sumAktual) * 100).toFixed(2)) -
            parseFloat(((e.historical / sumHistorical) * 100).toFixed(2))
          ).toFixed(2) + "%",
        bobot_gap:
          e.historical === 0 && e.aktual > 0
            ? "100%"
            : ((e.aktual / e.historical - 1) * 100).toFixed(2) + "%",
      }));
      data.push({
        subbrand: "Total",
        aktual: sumAktual,
        historical: sumHistorical,
        gap: sumGap,
        bobot_historical: "100%",
        bobot_aktual: "100%",
        bobot_growth:
          (
            parseFloat(((sumAktual / sumAktual) * 100).toFixed(2)) -
            parseFloat(((sumHistorical / sumHistorical) * 100).toFixed(2))
          ).toFixed(2) + "%",
        bobot_gap:
          sumHistorical === 0 && sumAktual > 0
            ? "100%"
            : ((sumAktual / sumHistorical - 1) * 100).toFixed(2) + "%",
      });
      data = NumberFormat(data, true, "aktual", "historical", "gap");
      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getSalesReportPerCategory(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any[] = await Service.getSalesReportPerCategory();
      const sumAktual = sumDataBy(data, "aktual");
      const sumHistorical = sumDataBy(data, "historical");
      const sumGap = sumDataBy(data, "gap");
      data = data.map((e: any) => ({
        ...e,
        bobot_historical:
          ((e.historical / sumHistorical) * 100).toFixed(2) + "%",
        bobot_aktual: ((e.aktual / sumAktual) * 100).toFixed(2) + "%",
        bobot_growth:
          (
            parseFloat(((e.aktual / sumAktual) * 100).toFixed(2)) -
            parseFloat(((e.historical / sumHistorical) * 100).toFixed(2))
          ).toFixed(2) + "%",
        bobot_gap:
          e.historical === 0 && e.aktual > 0
            ? "100%"
            : ((e.aktual / e.historical - 1) * 100).toFixed(2) + "%",
      }));
      data.push({
        subbrand: "Total",
        aktual: sumAktual,
        historical: sumHistorical,
        gap: sumGap,
        bobot_historical: "100%",
        bobot_aktual: "100%",
        bobot_growth:
          (
            parseFloat(((sumAktual / sumAktual) * 100).toFixed(2)) -
            parseFloat(((sumHistorical / sumHistorical) * 100).toFixed(2))
          ).toFixed(2) + "%",
        bobot_gap:
          sumHistorical === 0 && sumAktual > 0
            ? "100%"
            : ((sumAktual / sumHistorical - 1) * 100).toFixed(2) + "%",
      });
      data = NumberFormat(data, true, "aktual", "historical", "gap");
      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
}

export default new Report();
