import { Request, Response } from "express";
import response from "../helpers/Response";
import Service from "../services/Outlet";

class Outlet {
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      const data = await Service.get(req);
      req.log(req, false, "Success get outlet data [200]");
      return response(res, true, data, null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
  async getOutletTransaction(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const aktif :any[] = await Service.getOutletTActive(req);
      const totalOutlet :any[] = await Service.getOutletCount(req);
      const result :object = {
        aktif: aktif[0].aktif,
        totalOutlet: totalOutlet[0].total
      }
      req.log(req, false, "Success get outlet data [200]");
      return response(res, true, result, null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
  async getOutletRegistrasi(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const regist :any[] = await Service.getOutletRegisterCount(req);
      const totalOutlet :any[] = await Service.getOutletCount(req);
      const result :object = {
        regist: regist[0].total,
        percentage: ((regist[0].total / totalOutlet[0].total) * 100).toFixed(2) + "%",
        notregist: totalOutlet[0].total - regist[0].total,
        totalOutlet: totalOutlet[0].total
      }
      req.log(req, false, "Success get outlet data [200]");
      return response(res, true, result, null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
  async getLastOutletRegistrasi(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const regist :any[] = await Service.getLastOutletRegister(req);
      req.log(req, false, "Success get outlet data [200]");
      return response(res, true, regist, null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
  async getOutletRegistrasiSummary(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let regist :any[] = await Service.getOutletRegisterSummary(req)
      regist = regist.map((val:any) => ({
        ...val,
        total: (val.regist + val.notregist),
        percentage: ((val.regist / (val.regist + val.notregist)) * 100).toFixed(2) + "%"
      }))

      req.log(req, false, "Success get outlet data [200]");
      return response(res, true, regist, null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
  async getOutletPoint(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const achiev :any[] = await Service.getOutletPoint(req);
      const redeem :any[] = await Service.getOutletPointRedeem(req);
      const result :object = {
        achiev: new Intl.NumberFormat('id').format(achiev[0].perolehan),
        redeem: new Intl.NumberFormat('id').format(redeem[0].penukaran * redeem[0].qty)
      }
      req.log(req, false, "Success get outlet data [200]");
      return response(res, true, result, null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
}

export default new Outlet();
