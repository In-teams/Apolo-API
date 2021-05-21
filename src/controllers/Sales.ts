import { Request, Response } from "express";
import NumberFormat from "../helpers/NumberFormat";
import response from "../helpers/Response";
import Service from "../services/Sales";

class Auth {
  async getTarget(req: Request, res: Response): Promise<object | undefined> {
    try {
      const { area, wilayah, region, distributor, outlet } = req.query;
      let data: any[1] = [];
      if (area && !distributor) data = await Service.getTargetByArea(req);
      if (distributor && !outlet) data = await Service.getTargetByDistributor(req);
      data = NumberFormat(data, "total");
      req.log(req, false, "Success add user data [200]");
      return response(res, true, data, null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
}

export default new Auth();
