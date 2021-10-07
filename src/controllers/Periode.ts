import { Request, Response } from "express";
import DateFormat from "../helpers/DateFormat";
import response from "../helpers/Response";
import Scheduler from "../helpers/Scheduler";
import Outlet from "../services/Outlet";
import Service from "../services/Periode";

class Periode {
  async create(req: Request, res: Response): Promise<object | undefined> {
    try {
      const date = DateFormat.getNextDate(
        req.validated.tgl_selesai,
        1,
        "YYYY-MM-DD"
      );

      Scheduler.start(date, async () => {
        return await Outlet.resetRegistration();
      });
      await Service.create(req);
      return response(res, true, "Success Create New Periode", null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async update(req: Request, res: Response): Promise<object | undefined> {
    try {
      const oldDate = DateFormat.getNextDate(
        req.validated.old_tgl_selesai,
        1,
        "YYYY-MM-DD"
      );
      const date = DateFormat.getNextDate(
        req.validated.tgl_selesai,
        1,
        "YYYY-MM-DD"
      );
      Scheduler.reschedule(oldDate, date, async () => {
        return await Outlet.resetRegistration();
      });
      await Service.update(req);
      return response(res, true, "Success Update Periode", null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async delete(req: Request, res: Response): Promise<object | undefined> {
    try {
      const oldDate = DateFormat.getNextDate(
        req.validated.old_tgl_selesai,
        1,
        "YYYY-MM-DD"
      );
      Scheduler.stop(oldDate, async () => {
        console.log("reset");
      });
      await Service.delete(req);
      return response(res, true, "Success Delete Periode", null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data: any[] = await Service.gets(req);
      data = DateFormat.index(data, "DD MMMM YYYY", "tgl_mulai", "tgl_selesai");
      data = DateFormat.index(data, "DD MMMM YYYY H:m:s", "created_at");
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
}

export default new Periode();
