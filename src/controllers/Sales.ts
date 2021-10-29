import { Request, Response } from "express";
import NumberFormat from "../helpers/NumberFormat";
import response from "../helpers/Response";
import SalesHelper from "../helpers/SalesHelper";
import Service from "../services/Sales";
import _ from "lodash";
import Registration from "../services/Registration";
import Outlet from "../services/Outlet";
import Redeem from "../services/Redeem";
import ArrayOfObjToObj from "../helpers/ArrayOfObjToObj";
import Wilayah from "../services/Wilayah";
import SalesHelper2 from "../helpers/SalesHelper2";

const getCluster = (aktual: number, target: number): string => {
  const data = +((aktual / target) * 100).toFixed(2);
  if (data < 25) return "0% - 25%";
  if (data >= 25 && data < 50) return "25% - 50%";
  if (data >= 50 && data < 70) return "50% - 70%";
  if (data >= 70 && data < 95) return "70% - 95%";
  if (data >= 95 && data < 100) return "95% - 100%";
  return ">= 100";
};

class Sales {
  async getSummaryByDistributor(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any = await Service.getSalesByDistributor(req);
      data = await SalesHelper(req, data, "distributor");
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getSummaryByArea(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any = await Service.getSalesByArea(req);
      data = await SalesHelper(req, data, "city");
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getSummaryByASM(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any = await Service.getSalesByASM(req);
      data = await SalesHelper(req, data, "nama_pic");
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getSummaryByASS(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any = await Service.getSalesByASS(req);
      data = await SalesHelper(req, data, "nama_pic");
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getSummaryByOutlet(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const outlet: any[] = await Outlet.get(req);
      let result: any[] = await SalesHelper2(
        req,
        outlet,
        "outlet",
        "outlet_id",
        "outlet_name",
        "outlet_name"
      );
      return response(res, true, result, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getSummaryByRegion(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any = await Service.getSalesByRegion(req);
      data = await SalesHelper(req, data, "region");
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getSummaryByHR(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let hr: any[] = await Wilayah.get(req);
      let result = await SalesHelper2(
        req,
        hr,
        "hr",
        "head_region_id",
        "wilayah",
        "head_region_name"
      );
      return response(res, true, result, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getSummaryByAchieve(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any = await Service.getSalesByAchiev(req);
      data = data.map((e: any) => ({
        ...e,
        aktual: +e.aktual,
      }));
      // data = NumberFormat(data, true, 'aktual', 'target')
      data = await SalesHelper(req, data, "cluster");
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getSummaryPerQuarter(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any = await Service.getSummaryPerQuarter(req);
      data = data.map((e: any) => ({
        ...e,
        aktual: +e.aktual,
      }));
      // data = NumberFormat(data, true, 'aktual', 'target')
      data = await SalesHelper(req, data, "bulan");
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getSummaryPerSemester(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any = await Service.getSummaryPerSemester(req);
      data = data.map((e: any) => ({
        ...e,
        kuartal: "Kuartal " + e.kuartal,
        aktual: +e.aktual,
      }));
      // data = NumberFormat(data, true, 'aktual', 'target')
      data = await SalesHelper(req, data, "kuartal");
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getSummaryPerYear(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any = await Service.getSummaryPerYear(req);
      data = data.map((e: any) => ({
        ...e,
        kuartal: "Semester " + e.kuartal,
        aktual: +e.aktual,
      }));
      // data = NumberFormat(data, true, 'aktual', 'target')
      data = await SalesHelper(req, data, "kuartal");
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getSummaryPerYears(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any = await Service.getSummaryPerYears(req);
      data = data.map((e: any) => ({
        ...e,
        kuartal: "Tahunan",
        aktual: +e.aktual,
      }));
      // data = NumberFormat(data, true, 'aktual', 'target')
      data = await SalesHelper(req, data, "kuartal", true);
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data: any = await Service.getSummary(req);
      let dataOutletActive: any = await Outlet.getOutletActive(req);
      let dataRegist: any = await Registration.getRegistrationSummary(req);
      const { regist } = dataRegist[0];
      const result: object = {
        ...dataOutletActive[0],
        regist: regist || 0,
        percentage_regist:
          ((regist / dataOutletActive[0].total_outlet) * 100).toFixed(2) + "%",
        percen_regist:
          ((regist / dataOutletActive[0].total_outlet) * 100).toFixed(2) + "%",
        notregist: dataOutletActive[0].total_outlet - regist,
        aoro: ((regist / dataOutletActive[0].aktif) * 100).toFixed(2) + "%",
      };
      let point = await Redeem.getPoint(req);
      let pointRedeem = await Redeem.getPointRedeem(req);
      let resultPoin = NumberFormat(
        { ...point[0], ...pointRedeem[0] },
        false,
        "achieve",
        "redeem"
      );
      resultPoin = {
        ...resultPoin,
        percentage_poin:
          ((resultPoin.redeem / resultPoin.achieve) * 100).toFixed(2) + "%",
        percen_poin: ((resultPoin.redeem / resultPoin.achieve) * 100).toFixed(
          2
        ),
        diff_poin: resultPoin.achieve - resultPoin.redeem,
      };
      data = data.map((val: any) => ({
        ...val,
        ...result,
        ...resultPoin,
        aktual: +val.aktual,
        avg: val.aktual / val.total_outlet,
        diff: val.aktual - val.target,
        percentage: ((val.aktual / val.target) * 100).toFixed(2) + " %",
      }));
      data = NumberFormat(data, true, "aktual", "target", "avg", "diff");
      data = NumberFormat(data, false, "achieve", "redeem", "diff_poin");
      return response(res, true, data[0], null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async coba(req: Request, res: Response): Promise<object | undefined> {
    try {
      const target = await Service.getTargetByHirarki(req, "outlet");
      const aktual = await Service.getAktualByHirarki(req, "outlet");

      const sumData = (data: any[], key: string) =>
        _.reduce(data, (prev: any, curr: any) => prev + curr[key], 0);
      const sumDataBy = (data: any[], key: string) =>
        _.sumBy(data, (o) => o[key]);
      const getPercentage = (val1: number, val2: number): string =>
        ((val1 / val2) * 100).toFixed(2) + "%";

      const match = target.map((e: any) => {
        const act = parseInt(
          aktual.find((a: any) => a.no_id === e.outlet_id)?.aktual || "0"
        );
        return {
          ...e,
          bobot_outlet: getPercentage(e.outlet, sumData(target, "outlet")),
          bobot_target: getPercentage(e.target, sumData(target, "target")),
          kontribusi: getPercentage(act, sumData(target, "target")),
          aktual: act,
          pencapaian: ((act / e.target) * 100).toFixed(2) + "%",
          cluster: getCluster(act, e.target),
        };
      });

      let grouping = _(match)
        .groupBy("cluster")
        .map((items) => ({
          cluster: items[0].cluster,
          aktual: sumDataBy(items, "aktual"),
          target: sumDataBy(items, "target"),
          outlet: sumDataBy(items, "outlet"),
          bobot_outlet: getPercentage(
            sumDataBy(items, "outlet"),
            sumData(target, "outlet")
          ),
          bobot_target: getPercentage(
            sumDataBy(items, "target"),
            sumData(target, "target")
          ),
          kontribusi: getPercentage(
            sumDataBy(items, "aktual"),
            sumData(target, "target")
          ),
          pencapaian: getPercentage(
            sumDataBy(items, "aktual"),
            sumDataBy(items, "target")
          ),
        }))
        .sortBy("cluster")
        .push({
          cluster: "Total Pencapaian",
          aktual: sumData(match, "aktual"),
          target: sumData(match, "target"),
          outlet: sumData(match, "outlet"),
          bobot_outlet: getPercentage(
            sumData(match, "outlet"),
            sumData(match, "outlet")
          ),
          bobot_target: getPercentage(
            sumData(match, "target"),
            sumData(match, "target")
          ),
          kontribusi: getPercentage(
            sumData(match, "aktual"),
            sumData(match, "target")
          ),
          pencapaian: getPercentage(
            sumData(match, "aktual"),
            sumData(match, "target")
          ),
        })
        .value();
      grouping = NumberFormat(grouping, true, "target", "aktual");
      return response(res, true, grouping, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
}

export default new Sales();
