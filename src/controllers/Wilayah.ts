import { Request, Response } from "express";
import response from "../helpers/Response";
import Service from "../services/Wilayah";

class Wilayah {
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      const data = await Service.get(req);
      req.log(req, false, "Success get wilayah data [200]");
      return response(res, true, data, null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
}

export default new Wilayah();
