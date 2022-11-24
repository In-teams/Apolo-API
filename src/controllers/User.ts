import {Request, Response} from "express";
import response from "../helpers/Response";
import Service from "../services/User";

class User {
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      const { level } = req.validated;
      let add = {};
      const key = "";
      let data: any[] = [];
      if (level === "asm") {
        data = await Service.getAsm(req);
        add = {
          nama_pic: "ALL",
          asm_id: null,
        };
      } else if (level === "ass") {
        data = await Service.getAss(req);
        add = {
          nama_pic: "ALL",
          ass_id: null,
        };
      } else if (level === "salesman") {
        data = await Service.getSalesman(req);
        add = {
          sales_name: "ALL",
          sales_id: null,
        };
      }

      return response(res, true, [add, ...data], null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
}

export default new User();
