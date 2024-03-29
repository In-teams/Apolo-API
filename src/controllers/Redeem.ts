import {Request, Response} from "express";
import _ from "lodash";
import db from "../config/db";
import App from "../helpers/App";
import DateFormat from "../helpers/DateFormat";
import FileSystem from "../helpers/FileSystem";
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
import Sales from "../services/Sales";
import User from "../services/User";
import Wilayah from "../services/Wilayah";
import config from "../config/app";
import IncrementCustom from "../helpers/IncrementCustom";

class Redeem {
  async otorisasi(req: Request, res: Response) {
    const t = await db.transaction();
    try {
      let lastId = await Service.getLastTrConfirmCode();
      lastId = IncrementCustom(lastId, "C", 7);
      const payload = {
        id_confirm: lastId,
        tgl_confirm: DateFormat.getToday("YYYY-MM-DD"),
        relased_by: req.decoded.user_id,
      };

      const detail = req.validated.items.map((e: any) => [e, lastId]);
      await Service.otorisasi(payload, detail, t);
      t.commit();
      return response(res, true, "Otorisasi sukses", null, 200);
    } catch (error) {
      t.rollback();
      console.log(error);
      return response(res, false, null, "Otorisasi gagal", 500);
    }
  }
  async purchase(req: Request, res: Response) {
    const t = await db.transaction();
    try {
      let lastId = await Service.getLastTrPurchaseCode();
      lastId = IncrementCustom(lastId, "LV", 4);
      const payload = {
        kode_pr: lastId,
        tanggal: DateFormat.getToday("YYYY-MM-DD HH:mm:ss"),
      };

      const detail = req.validated.items.map((e: any) => [e, lastId]);
      await Service.purchase(payload, detail, t);
      t.commit();
      return response(res, true, "Purchase Request Sukses", null, 200);
    } catch (error) {
      t.rollback();
      console.log(error);
      return response(res, false, null, "Purchase Request Gagal", 500);
    }
  }
  async checkout(req: Request, res: Response) {
    const t = await db.transaction();
    try {
      const outletPoint = await Service.getPointByOutlet(req);
      const outletPointRedeem = await Service.getPointRedeemByOutlet(req);
      const diff =
        parseInt(outletPoint[0]?.achieve || 0) -
        parseInt(outletPointRedeem[0]?.redeem || 0);
      const product: any[] = await Service.getProduct(req.validated, diff);
      const temp: any[] = [];
      let total = 0;
      let trCode = await Service.getLastTrRedeemCode();
      const today = DateFormat.getToday("YYYY-MM-DD HH:mm:ss");
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
        return response(res, false, null, "redeem gagal", 400);
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
          no_batch: "PPR",
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
        created_by: req.decoded.user_id,
        file_id: req.validated.file_id,
      }));
      const detail = temp.map((e: any) => ({
        kd_transaksi: e.kd_transaksi,
        kd_produk: e.product_id,
        nama_produk: e.nama_produk,
        quantity: e.quantity,
        point_satuan: e.point,
      }));
      const pulsaEwallet = temp
        .filter((e: any) => ["PULSA", "EWALLET"].includes(e.category))
        .map((e: any) => ({
          kd_transaksi: e.kd_transaksi,
          no_handphone: e.no_handphone,
        }));
      if (total > diff) {
        t.commit();
        return response(res, false, null, "poin tidak cukup", 400);
      }
      (await Service.insert(data, detail, pulsaEwallet, t)) + t.LOCK.UPDATE;
      t.commit();
      return response(res, true, "Redeem sukses", null, 200);
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  }
  async getProductCategory(req: Request, res: Response) {
    try {
      const outletPoint = await Service.getPointByOutlet(req);
      const outletPointRedeem = await Service.getPointRedeemByOutlet(req);
      const diff = parseFloat(
        (
          parseFloat(outletPoint[0]?.achieve || 0) -
          parseFloat(outletPointRedeem[0]?.redeem || 0)
        ).toFixed(2)
      );
      const product = await Service.getProductCategory(req, diff);
      return response(res, true, product, null, 200);
    } catch (error) {
      console.log(error);
    }
  }
  async getProduct(req: Request, res: Response) {
    try {
      const outletPoint = await Service.getPointByOutlet(req);
      const outletPointRedeem = await Service.getPointRedeemByOutlet(req);
      const diff = parseFloat(
        (
          parseFloat(outletPoint[0]?.achieve || 0) -
          parseFloat(outletPointRedeem[0]?.redeem || 0)
        ).toFixed(2)
      );
      const product = await Service.getProduct(req.validated, diff);
      return response(res, true, product, null, 200);
    } catch (error) {
      console.log(error);
    }
  }
  async getOutletPoin(req: Request, res: Response) {
    try {
      const outletPoint = await Service.getPointByOutlet(req);
      const outletPointRedeem = await Service.getPointRedeemByOutlet(req);
      const diff = parseFloat(
        (
          parseFloat(outletPoint[0]?.achieve || 0) -
          parseFloat(outletPointRedeem[0]?.redeem || 0)
        ).toFixed(2)
      );
      return response(
        res,
        true,
        { point: NumberFormat({ diff }, false, "diff") },
        null,
        200
      );
    } catch (error) {
      console.log(error);
    }
  }
  async validation(req: Request, res: Response) {
    const t = await db.transaction();
    try {
      await Service.validation({ ...req.validated, ...req.decoded }, t);
      t.commit();
      return response(res, true, "berhasil divalidasi", null, 200);
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  }
  async getRedeemStatus(req: Request, res: Response) {
    try {
      const status = await Service.getRedeemStatus();
      return response(res, true, status, null, 200);
    } catch (error) {
      console.log(error);
    }
  }
  async getRedeemFile(req: Request, res: Response) {
    try {
      let isUpload: any = await Service.getRedeemFileThisMonth(req);
      if (!isUpload) {
        isUpload = true;
      } else if (isUpload && req.decoded.level === "1") {
        isUpload = true;
      } else {
        isUpload = false;
      }
      let file = await Service.getRedeemFile(req);
      file = GetFile(req, file, "redeem", "filename");
      file = DateFormat.index(file, "DD MMMM YYYY, HH:mm:ss", "tgl_upload");
      return response(res, true, { isUpload, file }, null, 200);
    } catch (error) {
      console.log(error);
    }
  }
  async getRedeemHistory(req: Request, res: Response) {
    try {
      let histories = await Service.getRedeemHistory(req.validated);
      histories = histories.map((history: any) => ({
        ...history,
        file: req.validated.file,
        status:
          history.status_terima === "TELAH DITERIMA"
            ? "Sukses"
            : history.status_terima !== "TELAH DITERIMA" && !history.tgl_confirm
            ? "Otorisasi"
            : "Proses",
      }));
      histories = DateFormat.index(
        histories,
        "DD MMMM YYYY, HH:mm:ss",
        "tgl_transaksi"
      );
      return response(res, true, histories, null, 200);
    } catch (error) {
      console.log(error);
    }
  }
  async getRedeemHistoryDetail(req: Request, res: Response) {
    try {
      const { kd_transaksi, file_id, filename } = req.validated;
      const detail = await Service.getRedeemHistoryDetail(
        kd_transaksi,
        file_id
      );
      if (!detail) return response(res, false, null, "not found", 404);
      const { status_terima, tgl_confirm } = detail;
      if (status_terima === "TELAH DITERIMA") {
        detail.status = "Sukses";
      } else if (status_terima !== "TELAH DITERIMA" && !tgl_confirm) {
        detail.status = "Otorisasi";
      } else {
        detail.status = "Proses";
      }
      detail.tgl_transaksi = DateFormat.getDate(
        detail.tgl_transaksi,
        "DD MMMM YYYY, HH:mm:ss"
      );
      detail.file = filename;
      return response(res, true, detail, null, 200);
    } catch (error) {
      console.log(error);
    }
  }
  async getHistoryRedeemFile(req: Request, res: Response) {
    try {
      let file = await Service.getHistoryRedeemFile(req);
      let isRegis = await Outlet.outletIsRegist(req.validated.outlet_id);
      isRegis = ["Yes+", "Yes"].includes(isRegis);
      let isAllowCheckout = await Service.getRedeemFileByIdWithoutMonthFilter(
        req
      );
      isAllowCheckout = ["Level 4"].includes(isAllowCheckout.level);
      file = DateFormat.index(file, "DD MMMM YYYY, HH:mm:ss", "created_at");
      return response(
        res,
        true,
        { isRegis, isAllowCheckout, data: file },
        null,
        200
      );
    } catch (error) {
      console.log(error);
    }
  }
  async postBulky(req: Request, res: Response) {
    const transaction = await db.transaction();
    try {
      if (req.fileValidationError)
        return response(res, false, null, req.fileValidationError, 400);

      let files: any = req.files;
      if (!files) return response(res, false, null, "file tidak ada", 400);
      if (files.length < 1)
        return response(res, false, null, "file tidak ada", 400);
      files = files.map((e: any) => ({
        outlet_id: e.originalname.split(".").shift().split("_").shift(),
        filename: e.filename,
        tgl_upload: DateFormat.getToday("YYYY-MM-DD HH:mm:ss"),
        uploaded_by: req.decoded.user_id,
      }));

      let outletIds = files.map((e: any) => e.outlet_id);
      const checkOutlet = await Outlet.getOutletByIds(outletIds);
      const isUploaded = await Service.getRedeemFileByOutletIds(outletIds);
      const alreadyExistId: string[] = isUploaded.map((e: any) => e.outlet_id);
      let shouldUpdate = files
        .filter((e: any) => alreadyExistId.includes(e.outlet_id))
        .map((e: any) => ({
          ...e,
          id: isUploaded.find((x: any) => x.outlet_id === e.outlet_id).id,
        }));
      const shouldInsert = files
        .filter((e: any) => !alreadyExistId.includes(e.outlet_id))
        .filter((e: any) => checkOutlet.includes(e.outlet_id))
        .map((e: any) => {
          return Object.values(e);
        });
      const unknownFile: any[] = [];
      files
        .filter((e: any) => !checkOutlet.includes(e.outlet_id))
        .map((e: any) => {
          unknownFile.push(e.outlet_id);
          FileSystem.DeleteFile(`${config.pathRedeem}/${e.filename}`);
        });

      files = files
        .filter((e: any) => checkOutlet.includes(e.outlet_id))
        .map((e: any) => {
          return Object.values(e);
        });

      outletIds = outletIds.filter((e: any) => checkOutlet.includes(e));
      if (files.length < 1) {
        transaction.commit();
        return response(
          res,
          false,
          { unknownFile },
          "nama file harus sesuai dengan outlet_id",
          400
        );
      }
      if (shouldInsert.length > 0) {
        await Service.postRedeemFileBulky(shouldInsert, transaction);
      }
      if (shouldUpdate.length > 0) {
        if (req.decoded.level === "1") {
          await Service.updateBulkyRedeemForm(shouldUpdate, transaction);
        } else {
          shouldUpdate.map((e: any) => {
            FileSystem.DeleteFile(`${config.pathRedeem}/${e.filename}`);
          });
          shouldUpdate = [];
        }
      }
      // await Service.deleteRedeemFileByIds(outletIds, transaction);
      transaction.commit();
      return response(
        res,
        true,
        {
          unknownFile,
          updated: shouldUpdate.map((e: any) => e.outlet_id),
          inserted: shouldInsert.map((e: any) => e[0]),
        },
        null,
        200
      );
    } catch (error) {
      // t.rollback();
      console.log(error);
    }
  }
  async post(req: Request, res: Response) {
    const t = await db.transaction();
    try {
      await Service.postRedeemFile(
        { ...req.validated.file, ...req.decoded },
        t
      );
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
      const point = await Service.getPoint(req);
      const pointRedeem = await Service.getPointRedeem(req);
      const pointDiff = point[0].achieve - pointRedeem[0].redeem;
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
      const sumDataBy = (data: any[], key: string) =>
        _.sumBy(data, (o) => o[key]);
      const months = App.months;
      const aktual = await Sales.getAktualByMonth(req);
      const target = await Sales.getTargetByMonth(req);
      const point: any[] = await Service.getPointPerMonth(req);
      const pointRedeem: any[] = await Service.getPointRedeemPerMonth(req);
      let result: any[] = months.map((e: any) => ({
        ...e,
        achieve: parseFloat(point[e.id]?.achieve || 0),
        aktual: +aktual[e.id]?.aktual || 0,
        target: +target[e.month]?.target || 0,
        redeem: parseFloat(pointRedeem[e.id]?.redeem || 0),
        diff:
          parseFloat(point[e.id]?.achieve || 0) -
          parseFloat(pointRedeem[e.id]?.redeem || 0),
      }));

      result.push({
        month: "Total",
        achieve: sumDataBy(result, "achieve"),
        target: sumDataBy(result, "target"),
        redeem: sumDataBy(result, "redeem"),
        diff: sumDataBy(result, "diff"),
        aktual: sumDataBy(result, "aktual"),
      });
      result = NumberFormat(result, true, "aktual", "target");
      result = NumberFormat(result, false, "achieve", "redeem", "diff");
      return response(res, true, result, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getPointSummaryByQuarter(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const sumDataBy = (data: any[], key: string) =>
        _.sumBy(data, (o) => o[key]);
      const months = App.months;
      const aktual = await Sales.getAktualByMonth(req);
      const target = await Sales.getTargetByMonth(req);
      const point: any[] = await Service.getPointPerMonth(req);
      const pointRedeem: any[] = await Service.getPointRedeemPerMonth(req);
      const result = months.map((e: any) => ({
        ...e,
        quarter: App.getQuarter(e.id)[0].quarter,
        aktual: +aktual[e.id]?.aktual || 0,
        target: target[e.month]?.target || 0,
        redeem: parseFloat(pointRedeem[e.id]?.redeem || 0),
        achieve: parseFloat(point[e.id]?.achieve || 0),
        diff:
          parseFloat(point[e.id]?.achieve || 0) -
          parseFloat(pointRedeem[e.id]?.redeem || 0),
      }));
      let grouping: any[] = _(result)
        .groupBy("quarter")
        .map((q: any) => ({
          quarter: q[0].quarter,
          achieve: sumDataBy(q, "achieve"),
          redeem: sumDataBy(q, "redeem"),
          target: sumDataBy(q, "target"),
          aktual: sumDataBy(q, "aktual"),
          diff: sumDataBy(q, "diff"),
        }))
        .push({
          quarter: "Total",
          achieve: sumDataBy(result, "achieve"),
          target: sumDataBy(result, "target"),
          redeem: sumDataBy(result, "redeem"),
          diff: sumDataBy(result, "diff"),
          aktual: sumDataBy(result, "aktual"),
        })
        .value();
      grouping = NumberFormat(grouping, true, "target", "aktual");
      grouping = NumberFormat(grouping, false, "achieve", "redeem", "diff");
      return response(res, true, grouping, null, 200);
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
        "head_region_id",
        "head_region_name"
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
        "region_id",
        "region_name"
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
      const { sort } = req.validated;
      const point: any[] = await Service.getPointByArea(req);
      const pointRedeem: any[] = await Service.getPointRedeemByArea(req);
      let area: any[] = await Area.get(req);
      area = RedeemHelper(
        area,
        point,
        pointRedeem,
        req.validated,
        "city_id_alias",
        "area_id",
        "area_name"
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
      const point: any[] = await Service.getPointByDistributor(req);
      const pointRedeem: any[] = await Service.getPointRedeemByDistributor(req);
      let distributor: any[] = await Distributor.get(req);
      distributor = RedeemHelper(
        distributor,
        point,
        pointRedeem,
        req.validated,
        "distributor_id",
        "distributor_id",
        "distributor_name"
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
        "outlet_id",
        "outlet_name"
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
      const { sort } = req.validated;
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
