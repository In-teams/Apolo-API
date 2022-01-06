import { Request, Response } from "express";
import _ from "lodash";
import ExportExcel from "../helpers/ExportExcel";
import NumberFormat from "../helpers/NumberFormat";
import response from "../helpers/Response";
import Outlet from "../services/Outlet";
import Service from "../services/Report";

const sumDataBy = (data: any[], key: string) => _.sumBy(data, (o) => o[key]);

class Report {
  async exportRegistrationReport(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const data = await Service.exportRegistrationReport(req.validated);
      const columns = data.length > 0 ? Object.keys(data[0]) : [];
      return await ExportExcel(res, columns, data);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async exportRedeemReport(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const data: any[] = await Service.exportRedeemReport(req.validated);
      const custom: any[] = data.map((e: any) => ({
        outlet_dms: "-",
        outlet_scylla: e.outlet_id,
        outlet_name: e.outlet_name,
        kode: "-",
        product_name: e.nama_produk,
        qty: e.quantity,
        poin: e.point_satuan,
        total: e.point_total,
        no_tujuan: e.no_handphone,
        level: e.level,
        status: e.status,
        penukaran: e.penukaran,
        proses: e.proses,
        otorisasi: e.otorisasi,
        pengadaan: e.pengadaan,
        kirim: e.kirim,
        terima: e.terima,
        penerima: e.nama_penerima,
        status_pengiriman: e.status_terima,
        type: e.type,
        nama_file: e.filename,
        kode_transaksi: e.kd_transaksi,
        pod: e.pod,
        no_invoice: "-",
      }));
      const columns = data.length > 0 ? Object.keys(custom[0]) : [];
      return await ExportExcel(res, columns, custom);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getRegistrationReport(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const counts = await Service.getRegistrationReportCount(req.validated);
      const data = await Service.getRegistrationReport(req.validated);
      // const show = req.validated.show || 10;
      const totalPage = req.validated.show
        ? Math.ceil(counts[0].total / req.validated.show)
        : 1;
      return response(
        res,
        true,
        {
          countData: counts[0].total,
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
      const outletCount = await Service.getRedeemReportCount(req.validated);
      const data = await Service.getRedeemReport(req.validated);
      // const show = req.validated.show || 10;
      const totalPage = req.validated.show
        ? Math.ceil(outletCount[0].total / req.validated.show)
        : 1;
      return response(
        res,
        true,
        {
          countData: outletCount[0].total,
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
      const outletCount = await Service.getPointActivityCount(req.validated);
      let data = await Service.getPointActivity(req.validated);
      data = NumberFormat(data, true, "target", "aktual");
      data = NumberFormat(
        data,
        false,
        "bulanan",
        "kuartal",
        "poin_achieve",
        "poin_redeem",
        "tersedia"
      );
      const totalPage = req.validated.show
        ? Math.ceil(outletCount[0].total / req.validated.show)
        : 1;
      return response(
        res,
        true,
        {
          countData: outletCount[0].total,
          totalPage,
          data,
        },
        null,
        200
      );
    } catch (error) {
      console.log(error, "<<<<<<<");
      return response(res, false, null, error, 500);
    }
  }
  async exportPointActivityReport(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const data = await Service.exportPointActivityReport(req.validated);
      const columns = data.length > 0 ? Object.keys(data[0]) : [];
      return await ExportExcel(res, columns, data);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getRegistrationResumeReport(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any[] = await Service.getRegistrationResumeReport(
        req.validated
      );
      const types = ["BY PAPER", "BY WA"];
      types.map((e: any) => {
        if (!data.map((a: any) => a.type).includes(e)) {
          data.push({
            type: e,
            level1: 0,
            level2: 0,
            level3: 0,
            level4: 0,
            total: 0,
            level1percen: "0.00%",
            level2percen: "0.00%",
            level3percen: "0.00%",
            level4percen: "0.00%",
          });
        }
      });

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
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getRedeemResumeReport(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data: any[] = await Service.getRedeemResumeReport(req.validated);
      const total = sumDataBy(data, "total");
      const level1 = sumDataBy(data, "level1");
      const types = ["BY PAPER", "BY MICROSITE"];
      types.map((e: any) => {
        if (!data.map((a: any) => a.type).includes(e)) {
          data.push({
            type: e,
            level1: 0,
            level2: 0,
            level3: 0,
            level4: 0,
            total: 0,
            level1percen: "0.00%",
            level2percen: "0.00%",
            level3percen: "0.00%",
            level4percen: "0.00%",
          });
        }
      });
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
      console.log(error);
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
