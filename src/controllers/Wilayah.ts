import { Request, Response } from "express";
import response from "../helpers/Response";
import Service from "../services/Wilayah";

class Wilayah {
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      const data = await Service.get(req);
      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
}

export default new Wilayah();
