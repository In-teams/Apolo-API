import { Request, Response } from "express";
import Service from "../services/Periode";
import response from "../helpers/Response";
import DateFormat from "../helpers/DateFormat";

class Periode {
  async create(req: Request, res: Response): Promise<object | undefined> {
    try {
      await Service.create(req);
      return response(res, true, "Success Create New Periode", null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async update(req: Request, res: Response): Promise<object | undefined> {
    try {
      await Service.update(req);
      return response(res, true, "Success Update Periode", null, 200);
    } catch (error) {
        console.log(error)
      return response(res, false, null, error, 500);
    }
  }
  async delete(req: Request, res: Response): Promise<object | undefined> {
    try {
      await Service.delete(req);
      return response(res, true, "Success Delete Periode", null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data: any[] = await Service.get(req);
      data = DateFormat.index(data, "DD MMMM YYYY", "tgl_mulai", "tgl_selesai");
      data = DateFormat.index(data, "DD MMMM YYYY H:m:s", "created_at");
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
}

export default new Periode();
