import { Request, Response } from "express";
import db from "../config/db";
import DateFormat from "../helpers/DateFormat";
import FileSystem from "../helpers/FileSystem";
import GetFile from "../helpers/GetFile";
import RegistrationHelper from "../helpers/RegistrationHelper";
import response from "../helpers/Response";
import Outlet from "../services/Outlet";
import Service from "../services/Registration";

class Registration {
  async getFile(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data = await Service.getRegistrationFile(req);
      data = GetFile(req, data, "registration", "filename");
      data = DateFormat.index(
        data,
        "DD MMMM YYYY HH:mm:ss",
        "tgl_upload",
        "validated_at"
      );
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getRegistrationStatus(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data = await Service.getRegistrationStatus(req);
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getOutletData(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data = await Service.getOutletData(req.validated.outlet_id);
      let bank_file = await Service.getRegistrationFile(req, 3);
      let npwp_file = await Service.getRegistrationFile(req, 2);
      let ektp_file = await Service.getRegistrationFile(req, 1);
      data[0].bank_file = bank_file[0]?.filename || null;
      data[0].npwp_file = npwp_file[0]?.filename || null;
      data[0].ektp_file = ektp_file[0]?.filename || null;
      data[0].fill_alamat = 0
      data[0].fill_data_bank = 0
      let program: any[] = await Service.getOutletProgram(
        req.validated.outlet_id
        );
        if (program.filter((e: any) => e.jenis_hadiah === "MULTI")) {
          data[0].fill_alamat = 1
          data[0].fill_data_bank = 1
        }
        else if (program.filter((e: any) => e.jenis_hadiah === "DIGITAL")) {
          data[0].fill_data_bank = 1
        }
        else if (program.filter((e: any) => e.jenis_hadiah === "FISIK")) {
          data[0].fill_alamat = 1
      }

      data = GetFile(
        req,
        data,
        "registration",
        "bank_file",
        "npwp_file",
        "ektp_file"
      );
      return response(res, true, data[0], null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async getHistory(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data = await Service.getRegistrationHistory(req);
      data = DateFormat.index(data, "DD MMMM YYYY HH:mm:ss", "created_at");
      return response(res, true, data, null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
  async post(req: Request, res: Response): Promise<object | undefined> {
    const transaction = await db.transaction();
    try {
      await Service.insertRegistrationForm(req, transaction);
      transaction.commit();
      return response(res, true, "Form successfully uploaded", null, 200);
    } catch (error) {
      FileSystem.DeleteFile(req.validated.path);
      console.log(error);
      transaction.rollback();
      return response(res, false, null, error, 500);
    }
  }
  async update(req: Request, res: Response): Promise<object | undefined> {
    const transaction = await db.transaction();
    try {
      await Service.updateOutletData(req, transaction);
      transaction.commit();
      return response(res, true, "Data successfully updated", null, 200);
    } catch (error) {
      FileSystem.DeleteFile(req.validated.path);
      console.log(error);
      transaction.rollback();
      return response(res, false, null, error, 500);
    }
  }
  async validation(req: Request, res: Response): Promise<object | undefined> {
    const transaction = await db.transaction();
    try {
      await Service.validation(req, transaction);
      transaction.commit();
      return response(res, true, "Form successfully validated", null, 200);
    } catch (error) {
      console.log(error);
      transaction.rollback();
      return response(res, false, null, error, 500);
    }
  }
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      let outlet = await Outlet.getOutletCount(req)
      outlet = outlet[0].total
      const regist: any[] = await Service.getRegistrationSummary(req);
      const { regist:total } = regist[0];
      const result: object = {
        regist: total,
        percentage: ((total / outlet) * 100).toFixed(2) + "%",
        percen: parseFloat(((total / outlet) * 100).toFixed(2)),
        notregist: outlet - total,
        totalOutlet: outlet,
      };
      return response(res, true, result, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getSummaryByMonth(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let data = await Service.getRegistrationSummaryByMonth(req);
      data = data.map((e: any) => ({
        ...e,
        regist: e.regist || 0,
        notregist: e.outlet - e.regist,
      }));
      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getReportByMonth(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const status: any[] = await Service.getRegistrationStatus(req);
      let regist: any[] = await Service.getRegistrationReportByMonth(req);
      regist = regist.map((e: any) => ({
        ...e,
        [status[0].status]: e.totals - e.outlet,
      }));
      return response(
        res,
        true,
        { data: regist, key: status.map((e: any) => e.status) },
        null,
        200
      );
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getRegistrationSummaryByHR(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let regist: any[] = await Service.getRegistrationSummaryByHR(req);
      regist = RegistrationHelper(regist, "wilayah");
      return response(res, true, regist, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getRegistrationSummaryByRegion(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let regist: any[] = await Service.getRegistrationSummaryByRegion(req);
      regist = RegistrationHelper(regist, "region");
      return response(res, true, regist, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getRegistrationSummaryByArea(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let regist: any[] = await Service.getRegistrationSummaryByArea(req);
      regist = RegistrationHelper(regist, "area");
      return response(res, true, regist, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getRegistrationSummaryByDistributor(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let regist: any[] = await Service.getRegistrationSummaryByDistributor(
        req
      );
      regist = RegistrationHelper(regist, "distributor");
      return response(res, true, regist, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getRegistrationSummaryByOutlet(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let regist: any[] = await Service.getRegistrationSummaryByOutlet(req);
      regist = RegistrationHelper(regist, "outlet");
      return response(res, true, regist, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getRegistrationSummaryByASM(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let regist: any[] = await Service.getRegistrationSummaryByASM(req);
      regist = RegistrationHelper(regist, "nama_pic");
      return response(res, true, regist, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getRegistrationSummaryByASS(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let regist: any[] = await Service.getRegistrationSummaryByASS(req);
      regist = RegistrationHelper(regist, "nama_pic");
      return response(res, true, regist, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
  async getLastRegistration(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let regist: any[] = await Service.getLastRegistration(req);
      regist = DateFormat.index(regist, "DD MMMM YYYY HH:mm:ss", "tgl_upload")
      return response(res, true, regist, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
}

export default new Registration();
