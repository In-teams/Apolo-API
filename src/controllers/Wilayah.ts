import { Request, Response } from "express";
import response from "../helpers/Response";
import Service from "../services/Wilayah";

class Wilayah {
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      interface head_region {
				head_region_id: string | null;
				head_region_name: string;
			}
			let data: head_region[] = await Service.get(req);
			data = [
				{
					head_region_name: 'ALL',
					head_region_id: null,
				}, ...data
			];
			return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
}

export default new Wilayah();
