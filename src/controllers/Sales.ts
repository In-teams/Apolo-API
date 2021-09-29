import { Request, Response } from "express";
import NumberFormat from "../helpers/NumberFormat";
import response from "../helpers/Response";
import SalesHelper from "../helpers/SalesHelper";
import Service from "../services/Sales";
import _ from "lodash";

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
      return response(res, false, null, JSON.stringify(error), 500);
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
      return response(res, false, null, JSON.stringify(error), 500);
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
      return response(res, false, null, JSON.stringify(error), 500);
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
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async getSummaryByOutlet(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any = await Service.getSalesByOutlet(req);
      data = await SalesHelper(req, data, "outlet");
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, JSON.stringify(error), 500);
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
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async getSummaryByHR(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any = await Service.getSalesByHR(req);
      data = await SalesHelper(req, data, "wilayah");
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, JSON.stringify(error), 500);
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
      return response(res, false, null, JSON.stringify(error), 500);
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
      return response(res, false, null, JSON.stringify(error), 500);
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
      return response(res, false, null, JSON.stringify(error), 500);
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
      return response(res, false, null, JSON.stringify(error), 500);
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
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data: any = await Service.getSummary(req);
      data = data.map((val: any) => ({
        ...val,
        aktual: +val.aktual,
        avg: val.aktual / val.total_outlet,
        diff: val.aktual - val.target,
        percentage: ((val.aktual / val.target) * 100).toFixed(2) + " %",
      }));
      data = NumberFormat(data, true, "aktual", "target", "avg", "diff");
      // data = await SalesHelper(req, data, 'kuartal', true)
      return response(res, true, data[0], null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async coba(req: Request, res: Response): Promise<object | undefined> {
    try {
      const target = await Service.getTargetByOutlet(req);
      const aktual = await Service.getAktualByOutlet(req);
      const match = target.map((e: any) => ({
        ...e,
        aktual: parseInt(
          aktual.find((a: any) => a.no_id === e.outlet_id)?.aktual || "0"
        ),
        cluster: getCluster(
          parseInt(
            aktual.find((a: any) => a.no_id === e.outlet_id)?.aktual || "0"
          ),
          e.target
        ),
      }));
      let grouping = _(match)
        .groupBy("cluster")
        .map((items) => ({
          cluster: items[0].cluster,
          aktual: _.sumBy(items, (o) => o.aktual),
          target: _.sumBy(items, (o) => o.target),
        }))
        .sortBy("cluster")
        .push({
          cluster: "Total Pencapaian",
          aktual: _.reduce(
            match,
            (prev: any, curr: any) => prev + curr.aktual,
            0
          ),
          target: _.reduce(
            match,
            (prev: any, curr: any) => prev + curr.target,
            0
          ),
        })
        .value();
      grouping = NumberFormat(grouping, true, "target", "aktual");
      return response(res, true, grouping, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
}

export default new Sales();
