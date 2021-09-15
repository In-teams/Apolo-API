import { Request, Response } from 'express';
import response from '../helpers/Response';
import Service from '../services/Area';

class Area {
	// async get(req: Request, res: Response): Promise<object | undefined> {
	// 	try {
	// 		interface area {
	// 			area_id: string | null;
	// 			area_name: string;
	// 		}
	// 		let data: area[] = await Service.get(req);
	// 		data = [
	// 			{
	// 				area_name: 'ALL',
	// 				area_id: null,
	// 			}, ...data
	// 		];
	// 		return response(res, true, data, null, 200);
	// 	} catch (error) {
	// 		return response(res, false, null, JSON.stringify(error), 500);
	// 	}
	// }
}

export default new Area();
