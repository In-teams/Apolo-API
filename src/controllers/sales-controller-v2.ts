import {Request, Response} from "express";
import NumberFormat from "../helpers/NumberFormat";
import response from "../helpers/Response";
import SalesHelper from "../helpers/SalesHelper";
import Service from "../services/Sales";
import _ from "lodash";
import Registration from "../services/Registration";
import Outlet from "../services/Outlet";
import Redeem from "../services/Redeem";
import ArrayOfObjToObj from "../helpers/ArrayOfObjToObj";

const getCluster = (
  aktual: number,
  target: number
): { cluster: string; id: number } => {
  const data = +((aktual / target) * 100).toFixed(2);
  if (data <= 0) return { cluster: "ZERO ACHIEVER <= 0% ", id: 5 };
  if (data > 0 && data < 70) return { cluster: "LOW ACHIEVER > 0%", id: 4 };
  if (data >= 70 && data < 90)
    return { cluster: "NEAR ACHIEVER >= 70%", id: 3 };
  if (data >= 90 && data < 100)
    return { cluster: "HIGH ACHIEVER >= 90%", id: 2 };
  return { cluster: "TOP ACHIEVER >= 100%", id: 1 };
};

const getSalesByHirarki = async (
  hirarki: string,
  payload: any
): Promise<any> => {
  // asc
  let asc = await Service.getSalesByHirarki(hirarki, {
    ...payload,
    sort: "ASC",
  });
  asc = NumberFormat(asc, true, "aktual", "target", "diff");
  asc = NumberFormat(asc, false, "achieve", "redeem", "diff_point");

  // desc
  let desc = await Service.getSalesByHirarki(hirarki, {
    ...payload,
    sort: "DESC",
  });
  desc = NumberFormat(desc, true, "aktual", "target", "diff");
  desc = NumberFormat(desc, false, "achieve", "redeem", "diff_point");

  return { asc, desc };
};

export class SalesControllerV2 {
  async getSummaryByDistributor(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let count: any = await Service.countSalesByHirarki(
        "distributor",
        req.validated
      );
      count = count[0]?.total || 0;
      const { show = 10, page = 1 } = req.validated;
      const totalPage = Math.ceil(count / show);
      // asc
      // let asc = await Service.getSalesByHirarki("distributor", {
      //     ...req.validated,
      //     sort: "ASC",
      // });
      // asc = NumberFormat(asc, true, "aktual", "target", "diff");
      // asc = NumberFormat(asc, false, "achieve", "redeem", "diff_point");

      // desc
      let desc = await Service.getSalesByHirarki("distributor", {
        ...req.validated,
      });
      desc = NumberFormat(desc, true, "aktual", "target", "diff");
      desc = NumberFormat(desc, false, "achieve", "redeem", "diff_point");
      return response(res, true, { totalPage, desc }, null, 200);
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
      // asc
      let count: any = await Service.countSalesByHirarki("area", req.validated);
      count = count[0]?.total || 0;
      const { show = 10, page = 1 } = req.validated;
      const totalPage = Math.ceil(count / show);

      // let asc = await Service.getSalesByHirarki("area", {
      //     ...req.validated,
      //     sort: "ASC",
      // });
      // asc = NumberFormat(asc, true, "aktual", "target", "diff");
      // asc = NumberFormat(asc, false, "achieve", "redeem", "diff_point");

      // desc
      let desc = await Service.getSalesByHirarki("area", {
        ...req.validated,
      });
      desc = NumberFormat(desc, true, "aktual", "target", "diff");
      desc = NumberFormat(desc, false, "achieve", "redeem", "diff_point");
      return response(res, true, { totalPage, desc }, null, 200);
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
      let count: any = await Service.countSalesByHirarki("asm", req.validated);
      count = count[0]?.total || 0;
      const { show = 10, page = 1 } = req.validated;
      const totalPage = Math.ceil(count / show);

      // asc
      // let asc = await Service.getSalesByHirarki("asm", {
      //     ...req.validated,
      //     sort: "ASC",
      // });
      // asc = NumberFormat(asc, true, "aktual", "target", "diff");
      // asc = NumberFormat(asc, false, "achieve", "redeem", "diff_point");

      // desc
      let desc = await Service.getSalesByHirarki("asm", {
        ...req.validated,
      });
      desc = NumberFormat(desc, true, "aktual", "target", "diff");
      desc = NumberFormat(desc, false, "achieve", "redeem", "diff_point");
      return response(res, true, { totalPage, desc }, null, 200);
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
      let count: any = await Service.countSalesByHirarki("ass", req.validated);
      count = count[0]?.total || 0;
      const { show = 10, page = 1 } = req.validated;
      const totalPage = Math.ceil(count / show);

      // asc
      // let asc = await Service.getSalesByHirarki("ass", {
      //     ...req.validated,
      //     sort: "ASC",
      // });
      // asc = NumberFormat(asc, true, "aktual", "target", "diff");
      // asc = NumberFormat(asc, false, "achieve", "redeem", "diff_point");

      // desc
      let desc = await Service.getSalesByHirarki("ass", {
        ...req.validated,
      });
      desc = NumberFormat(desc, true, "aktual", "target", "diff");
      desc = NumberFormat(desc, false, "achieve", "redeem", "diff_point");
      return response(res, true, { totalPage, desc }, null, 200);
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
      let count: any = await Service.countSalesByHirarki(
        "outlet",
        req.validated
      );
      count = count[0]?.total || 0;
      const { show = 10, page = 1 } = req.validated;
      const totalPage = Math.ceil(count / show);

      // asc
      // let asc: any[] = await Service.getSalesByHirarki("outlet", {
      //     ...req.validated,
      //     sort: "ASC",
      // });
      // asc = NumberFormat(asc, true, "aktual", "target", "diff");
      // asc = NumberFormat(asc, false, "achieve", "redeem", "diff_point");

      // desc
      let desc: any[] = await Service.getSalesByHirarki("outlet", {
        ...req.validated,
      });
      desc = NumberFormat(desc, true, "aktual", "target", "diff");
      desc = NumberFormat(desc, false, "achieve", "redeem", "diff_point");
      return response(res, true, { totalPage, desc }, null, 200);
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
      let count: any = await Service.countSalesByHirarki(
        "region",
        req.validated
      );
      count = count[0]?.total || 0;
      const { show = 10, page = 1 } = req.validated;
      const totalPage = Math.ceil(count / show);

      // asc
      // let asc = await Service.getSalesByHirarki("region", {
      //     ...req.validated,
      //     sort: "ASC",
      // });
      // asc = NumberFormat(asc, true, "aktual", "target", "diff");
      // asc = NumberFormat(asc, false, "achieve", "redeem", "diff_point");

      // desc
      let desc = await Service.getSalesByHirarki("region", {
        ...req.validated,
      });
      desc = NumberFormat(desc, true, "aktual", "target", "diff");
      desc = NumberFormat(desc, false, "achieve", "redeem", "diff_point");
      return response(res, true, { totalPage, desc }, null, 200);
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
      let count: any = await Service.countSalesByHirarki(
        "wilayah",
        req.validated
      );
      count = count[0]?.total || 0;
      const { show = 10, page = 1 } = req.validated;
      const totalPage = Math.ceil(count / show);

      // asc
      // let asc = await Service.getSalesByHirarki("wilayah", {
      //     ...req.validated,
      //     sort: "ASC",
      // });
      // asc = NumberFormat(asc, true, "aktual", "target", "diff");
      // asc = NumberFormat(asc, false, "achieve", "redeem", "diff_point");

      // desc
      let desc = await Service.getSalesByHirarki("wilayah", {
        ...req.validated,
      });
      desc = NumberFormat(desc, true, "aktual", "target", "diff");
      desc = NumberFormat(desc, false, "achieve", "redeem", "diff_point");
      return response(res, true, { totalPage, desc }, null, 200);
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
      let result = await Service.getSalesByAchiev(req.validated);
      result = NumberFormat(result, true, "aktual", "target", "diff");
      return response(res, true, result, null, 200);
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
        kuartal: "QUARTER " + e.kuartal,
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
      const dataOutletActive: any = await Outlet.getOutletActive(req);
      const dataRegist: any = await Registration.getRegistrationSummary(req);
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
      const point = await Redeem.getPoint(req);
      const pointRedeem = await Redeem.getPointRedeem(req);
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
      const sumData = (data: any[], key: string) =>
        _.reduce(data, (prev: any, curr: any) => prev + curr[key], 0);
      const sumDataBy = (data: any[], key: string) =>
        _.sumBy(data, (o) => o[key]);
      const outlet: any[] = await Outlet.get(req);
      let targets: any[] = await Service.getTargetByHirarki(req, "outlet");
      const totalOutlet: number = sumDataBy(targets, "outlet");
      const totalTarget = sumData(targets, "target");
      targets = ArrayOfObjToObj(targets, "outlet_id", "target", "outlet");
      let aktuals: any = await Service.getAktualByHirarki(req, "outlet");
      aktuals = ArrayOfObjToObj(aktuals, "outlet_id", "aktual", "outlet");

      const getPercentage = (val1: number, val2: number): string =>
        ((val1 / val2) * 100).toFixed(2) + "%";

      const match = outlet.map((e: any) => {
        const target = targets[e.outlet_id]?.target || 0;
        const aktual = +aktuals[e.outlet_id]?.aktual || 0;
        const diff = aktual - target;
        const outlet = targets[e.outlet_id]?.outlet || 0;
        const ao = aktuals[e.outlet_id]?.outlet || 0;
        const aoro = ((ao / outlet) * 100).toFixed(2) + "%";
        return {
          ...e,
          bobot_outlet: getPercentage(outlet, totalOutlet),
          bobot_target: getPercentage(target, totalTarget),
          kontribusi: getPercentage(aktual, totalTarget),
          ao,
          aoro,
          aktual,
          target,
          diff,
          outlet,
          pencapaian: ((aktual / target) * 100).toFixed(2) + "%",
          cluster: getCluster(aktual, target).cluster,
          id: getCluster(aktual, target).id,
        };
      });

      let grouping = _(match)
        .groupBy("cluster")
        .map((items) => ({
          cluster: items[0].cluster,
          id: items[0].id,
          aktual: sumDataBy(items, "aktual"),
          target: sumDataBy(items, "target"),
          diff: sumDataBy(items, "aktual") - sumDataBy(items, "target"),
          outlet: sumDataBy(items, "outlet"),
          ao: sumDataBy(items, "ao"),
          aoro: getPercentage(
            sumDataBy(items, "ao"),
            sumDataBy(items, "outlet")
          ),
          bobot_outlet: getPercentage(sumDataBy(items, "outlet"), totalOutlet),
          bobot_target: getPercentage(sumDataBy(items, "target"), totalTarget),
          kontribusi: getPercentage(sumDataBy(items, "aktual"), totalTarget),
          pencapaian: getPercentage(
            sumDataBy(items, "aktual"),
            sumDataBy(items, "target")
          ),
        }))
        .sortBy("id")
        .push({
          cluster: "Total Pencapaian",
          id: "Total Pencapaian",
          aktual: sumData(match, "aktual"),
          target: sumData(match, "target"),
          outlet: sumData(match, "outlet"),
          diff: sumData(match, "outlet"),
          ao: sumData(match, "ao"),
          aoro: getPercentage(sumData(match, "ao"), sumData(match, "outlet")),
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
      grouping = NumberFormat(grouping, true, "target", "aktual", "diff");
      return response(res, true, grouping, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
}

// export default new SalesControllerV2();
