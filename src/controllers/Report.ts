import { Request, Response } from "express";
import response from "../helpers/Response";
import Outlet from "../services/Outlet";
import Service from "../services/Report";

class Report {
  async getRegistrationReport(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const outletCount = await Outlet.getOutletCount(req);
      const data = await Service.getRegistrationReport(req.validated);
      const show = req.validated.show || 10;
      const totalPage = Math.ceil(outletCount[0].total / show);
      return response(
        res,
        true,
        {
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
}

export default new Report();
