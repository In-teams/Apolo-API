import { Request, Response } from 'express';
import response from '../helpers/Response';
import Token from '../helpers/Token';
import Service from '../services/Auth';

class Auth {
	async register(req: Request, res: Response): Promise<object | undefined> {
		try {
			await Service.addUser(req);
			return response(res, true, 'Account has been created', null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async login(req: Request, res: Response): Promise<object | undefined> {
		try {
			const data = await Service.getUserByUsername(req);
			if (data.length === 0)
				return response(res, false, null, 'Account Not Found', 404);
			const passwordCheck = await Service.getUser(req);
			if (passwordCheck.length === 0)
				return response(res, false, null, 'Password wrong', 404);

			data[0].token = Token.createToken(data[0]);
			data[0].refreshtoken = Token.createToken(data[0], true);
			return response(res, true, data[0], null, 200);
		} catch (error) {
			console.log(error);
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
}

export default new Auth();
