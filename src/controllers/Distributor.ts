import { Request, Response } from "express";
import response from "../helpers/Response";
import Service from "../services/Distributor";

class Distributor {
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      interface distributor {
				distributor_id: string | null;
				distributor_name: string;
			}
			let data: distributor[] = await Service.get(req);
			data = [
				{
					distributor_name: 'ALL',
					distributor_id: null,
				}, ...data
			];
			return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
}

export default new Distributor();
