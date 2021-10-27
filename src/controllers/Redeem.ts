import { Request, Response } from "express";
import db from "../config/db";
import App from "../helpers/App";
import DateFormat from "../helpers/DateFormat";
import GetFile from "../helpers/GetFile";
import IncrementNumber from "../helpers/IncrementNumber";
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
  async checkout(req: Request, res: Response) {
    const t = await db.transaction();
    try {
      let outletPoint = await Service.getPointByOutlet(req);
      let outletPointRedeem = await Service.getPointRedeemByOutlet(req);
      let diff =
        parseInt(outletPoint[0]?.achieve || 0) -
        parseInt(outletPointRedeem[0]?.redeem || 0);
      let product: any[] = await Service.getProduct(req, diff);
      let temp: any[] = [];
      let total: number = 0;
      let trCode = await Service.getLastTrRedeemCode();
      const today = DateFormat.getToday("YYYY-MM-DD");
      trCode = IncrementNumber(trCode);
      const product_id: any[] = req.validated.product.map(
        (e: any) => e.product_id
      );
      let filtered: any[] = [];
      product_id.map((p: any) => {
        const result = product.filter((e: any) => e.product_id === p);
        if (result.length > 0) {
          filtered = [...filtered, ...result];
        }
      });
      if (filtered.length < 1)
        return response(res, false, null, "something wrong", 400);
      req.validated.product
        .map((e: any) => ({
          ...e,
          category: product.find((x: any) => x.product_id === e.product_id)
            .category,
          nama_produk: product.find((x: any) => x.product_id === e.product_id)
            .product_name,
          point: product.find((x: any) => x.product_id === e.product_id).point,
          no_id: req.validated.outlet_id,
          tgl_transaksi: today,
          status: "R",
          no_batch: "MS",
          program_id: "MON-001",
        }))
        .map((e: any) => {
          total += e.point * e.quantity;
          if (e.category === "PULSA" || e.category === "EWALLET") {
            for (let i = 0; i < e.quantity; i++) {
              temp.push({ ...e, quantity: 1, kd_transaksi: trCode });
              trCode = IncrementNumber(trCode);
            }
          } else {
            temp.push({ ...e, kd_transaksi: trCode });
          }
          trCode = IncrementNumber(trCode);
        });
      const data = temp.map((e: any) => ({
        kd_transaksi: e.kd_transaksi,
        tgl_transaksi: e.tgl_transaksi,
        no_batch: e.no_batch,
        program_id: e.program_id,
        no_id: e.no_id,
        status: e.status,
      }));
      const detail = temp.map((e: any) => ({
        kd_transaksi: e.kd_transaksi,
        kd_produk: e.product_id,
        nama_produk: e.nama_produk,
        quantity: e.quantity,
        point_satuan: e.point,
      }));
      if (total > diff)
        return response(res, false, null, "poin tidak cukup", 400);
      await Service.insert(data, detail, t);
      t.commit();
      return response(res, true, "Redeem sukses", null, 200);
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  }
  async getProductCategory(req: Request, res: Response) {
    try {
      let outletPoint = await Service.getPointByOutlet(req);
      let outletPointRedeem = await Service.getPointRedeemByOutlet(req);
      let diff =
        outletPoint[0]?.achieve || 0 - outletPointRedeem[0]?.redeem || 0;
      let product = await Service.getProductCategory(req, diff);
      return response(res, true, product, null, 200);
    } catch (error) {
      console.log(error);
    }
  }
  async getProduct(req: Request, res: Response) {
    try {
      let outletPoint = await Service.getPointByOutlet(req);
      let outletPointRedeem = await Service.getPointRedeemByOutlet(req);
      let diff =
        parseFloat(outletPoint[0]?.achieve || 0) -
        parseFloat(outletPointRedeem[0]?.redeem || 0);
      let product = await Service.getProduct(req, diff);
      return response(res, true, product, null, 200);
    } catch (error) {
      console.log(error);
    }
  }
  async validation(req: Request, res: Response) {
    const t = await db.transaction();
    try {
      await Service.validation(req.validated, t);
      t.commit();
      return response(res, true, "berhasil divalidasi", null, 200);
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  }
  async getRedeemStatus(req: Request, res: Response) {
    try {
      let status = await Service.getRedeemStatus();
      return response(res, true, status, null, 200);
    } catch (error) {
      console.log(error);
    }
  }
  async getRedeemFile(req: Request, res: Response) {
    try {
      let file = await Service.getRedeemFile(req);
      file = GetFile(req, file, "redeem", "filename");
      file = DateFormat.index(file, "DD MMMM YYYY HH:mm:ss", "tgl_upload");
      return response(res, true, file, null, 200);
    } catch (error) {
      console.log(error);
    }
  }
  async getHistoryRedeemFile(req: Request, res: Response) {
    try {
      let file = await Service.getHistoryRedeemFile(req);
      file = DateFormat.index(file, "DD MMMM YYYY HH:mm:ss", "created_at");
      return response(res, true, file, null, 200);
    } catch (error) {
      console.log(error);
    }
  }
  async post(req: Request, res: Response) {
    const t = await db.transaction();
    try {
      await Service.postRedeemFile(req, t);
      t.commit();
      return response(res, true, "Form successfully uploaded", null, 200);
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  }
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
