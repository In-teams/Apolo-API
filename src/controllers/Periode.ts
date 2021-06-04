import { Request, Response } from "express";
import Service from "../services/Periode";
import response from "../helpers/Response";
import DateFormat from "../helpers/DateFormat";

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
  async update(req: Request, res: Response): Promise<object | undefined> {
    try {
      await Service.update(req);
      req.log(req, false, "Success post data [200]");
      return response(res, true, "Success Update Periode", null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
  async delete(req: Request, res: Response): Promise<object | undefined> {
    try {
      await Service.delete(req);
      req.log(req, false, "Success post data [200]");
      return response(res, true, "Success Delete Periode", null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data: any[1] = await Service.get(req);
      data = DateFormat(data, "tgl_mulai", "tgl_selesai", "created_at");
      req.log(req, false, "Success post data [200]");
      return response(res, true, data, null, 200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error.message));
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
}

export default new Periode();
