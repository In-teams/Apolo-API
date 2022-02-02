import { Request, Response } from "express";
import response from "../helpers/Response";
import Service from "../services/District";

class District {
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data: any[] = Object.keys(req.validated).length > 0 ? await Service.get(req.validated) : [];
      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
}

export default new District();
