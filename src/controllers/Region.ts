import { Request, Response } from "express";
import response from "../helpers/Response";
import Service from "../services/Region";

class Region {
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      interface region {
				region_id: string | null;
				region_name: string;
			}
			let data: region[] = await Service.get(req);
			data = [
				{
					region_name: 'ALL',
					region_id: null,
				}, ...data
			];
			return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }
}

export default new Region();
