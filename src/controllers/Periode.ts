import { Request, Response } from "express";
import Service from "../services/Periode";
import response from "../helpers/Response";

class Periode {
  async create(req: Request, res: Response): Promise<object | undefined> {
    try {
      await Service.create(req);
      req.log(req, false, "Success post data [200]");
      return response(res, true, "Success Create New Periode", null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
}

export default new Periode();
