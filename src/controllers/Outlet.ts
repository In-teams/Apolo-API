import { Request, Response } from "express";
import response from "../helpers/Response";
import Service from "../services/Outlet";

class Outlet {
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
			let data: any[] = await Service.get(req);
			data = [
				{
					outlet_name: 'ALL',
					outlet_id: null,
				}, ...data
			];
			return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
  async getOutletActive(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      const active: any[] = await Service.getOutletActive(req);
      return response(res, true, active[0], null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
}

export default new Outlet();
