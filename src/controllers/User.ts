import { Request, Response } from "express";
import response from "../helpers/Response";
import Service from "../services/User";

class User {
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      const { level } = req.validated;
      let data: string[] = [];
      if (level === "asm") data = await Service.getAsm(req);
      if (level === "ass") data = await Service.getAss(req);
      if (level === "salesman") data = await Service.getSalesman(req);

      req.log(req, false, "Success get User data [200]");
      return response(res, true, data, null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
}

export default new User();
