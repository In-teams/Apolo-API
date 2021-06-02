import { Request, Response } from "express";
import NumberFormat from "../helpers/NumberFormat";
import response from "../helpers/Response";
import Service from "../services/Sales";
import OutletService from "../services/Outlet";

class Auth {
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      let target: any[1] = await Service.getTarget(req);
      let aktual: any[1] = await Service.getAktual(req);
      let totalOutlet: any[1] = await OutletService.getCount(req);

      let ratarata: any[1] = [
        { total: aktual[0].total / totalOutlet[0].total },
      ];
      let selisih: any[1] = [{ total: aktual[0].total - target[0].total }];
      let percentage: string =
        ((aktual[0].total / target[0].total) * 100).toFixed(2) + " %";
      ratarata = NumberFormat(ratarata, "total");
      aktual = NumberFormat(aktual, "total");
      target = NumberFormat(target, "total");
      selisih = NumberFormat(selisih, "total");
      const result = {
        target: target[0].total,
        aktual: aktual[0].total,
        selisih: selisih[0].total,
        ratarata: ratarata[0].total,
        totalOutlet: totalOutlet[0].total,
        percentage,
      };
      // req.log(req, false, "Success add user target [200]");
      return response(res, true, result, null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
  
  async getSummary(req: Request, res: Response): Promise<object | undefined> {
    try {
      const data: any[] = await Service.getSummary(req)
      return response(res, true, data, null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
}

export default new Auth();
