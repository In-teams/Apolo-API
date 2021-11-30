import { Request, Response } from 'express';
import response from '../helpers/Response';
import Service from '../services/Report';

class Report {
	async getRegistrationReport(req: Request, res: Response): Promise<object | undefined> {
		try {
            
			return response(res, true, {}, null, 200);
		} catch (error) {
			return response(res, false, null, error, 500);
		}
	}
}

export default new Report();
