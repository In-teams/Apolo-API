import { Request, Response } from "express";
import NumberFormat from "../helpers/NumberFormat";
import response from "../helpers/Response";
import Service from "../services/Poin";

class Poin {
  async getPointSummary(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let point = await Service.getPointSummary(req);
      point = NumberFormat(point, false, "achieve", "redeem");
      req.log(req, false, "Success get Poin data [200]");
      return response(res, true, point[0], null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
}

export default new Poin();
