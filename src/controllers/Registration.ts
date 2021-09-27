import { Request, Response } from "express";
// import FileSystem from "../helpers/FileSystem";
import response from "../helpers/Response";
import Service from "../services/Registration";

class Registration {
  // async post(req: Request, res: Response): Promise<object | undefined> {
  //   const path = req.validated.path
  //   try {
  //     await Service.post(req);
  //     return response(res, true, "success post registration form", null, 200);
  //   } catch (error) {
  //     await FileSystem.DeleteFile(path)
  //     return response(res, false, null, JSON.stringify(error), 500);
  //   }
  // }
  // async validation(req: Request, res: Response): Promise<object | undefined> {
  //   const path = req.validated.path
  //   try {
  //     await Service.validation(req);
  //     return response(res, true, "success post registration form", null, 200);
  //   } catch (error) {
  //     await FileSystem.DeleteFile(path)
  //     return response(res, false, null, JSON.stringify(error), 500);
  //   }
  // }
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      const regist: any[] = await Service.getRegistrationSummary(req);
      const { total, total_outlet } = regist[0];
      const result: object = {
        regist: regist[0].total,
        percentage: ((total / total_outlet) * 100).toFixed(2) + "%",
        notregist: total_outlet - total,
        totalOutlet: total_outlet,
      };
      return response(res, true, result, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
//   async getLastRegistration(
//     req: Request,
//     res: Response
//   ): Promise<object | undefined> {
//     try {
//       const regist: any[] = await Service.getLastRegistration(req);
//       return response(res, true, regist, null, 200);
//     } catch (error) {
//       return response(res, false, null, JSON.stringify(error), 500);
//     }
//   }
//   async getRegistrationSummary(
//     req: Request,
//     res: Response
//   ): Promise<object | undefined> {
//     try {
//       let regist: any[] = await Service.getRegistationSummaryByHeadRegion(req);
//       regist = regist.map((val: any) => ({
//         ...val,
//         total: val.regist + val.notregist,
//         percentage:
//           ((val.regist / (val.regist + val.notregist)) * 100).toFixed(2) + "%",
//       }));

//       return response(res, true, regist, null, 200);
//     } catch (error) {
//       return response(res, false, null, JSON.stringify(error), 500);
//     }
//   }
}

export default new Registration();
