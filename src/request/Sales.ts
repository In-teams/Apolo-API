import { NextFunction, Request, Response } from 'express';
import joi from 'joi';
import response from '../helpers/Response';

class Auth {
	get(req: Request, res: Response, next: NextFunction): any {
		const schema = joi.object({
			page: joi.number(),
			show: joi.number(),
			quarter: joi.string(),
			sort: joi.string(),
			year: joi.string(),
			month: joi.string(),
			wilayah_id: joi.string(),
			region_id: joi.string(),
			area_id: joi.string(),
			ass_id: joi.string(),
			asm_id: joi.string(),
			salesman_id: joi.string(),
			distributor_id: joi.string(),
			outlet_id: joi.string(),
			quarter_id: joi.number().valid(1, 2, 3, 4),
			sem: joi.number().valid(1, 2),
		});

		const { value, error } = schema.validate(req.query);
		if (error) {
			return response(res, false, null, error.message, 400);
		}

		if (!isNaN(value.month))
			return response(
				res,
				false,
				null,
				'month just allowed string (monthname)',
				400
			);
		let quarter: number[] = [];
		let semester: number[] = [];
		if (value.sem) {
			switch (value.sem) {
				case 1:
					semester = [1, 2, 3, 4, 5, 6];
					break;
				case 2:
					semester = [7, 8, 9, 10, 11, 12];
					break;
			}
		}
		if (value.quarter_id) {
			switch (value.quarter_id) {
				case 1:
					quarter = [1, 2, 3];
					break;
				case 2:
					quarter = [4, 5, 6];
					break;
				case 3:
					quarter = [7, 8, 9];
					break;
				case 4:
					quarter = [10, 11, 12];
					break;
			}
		}
		const { page = 1, sort = 'ASC' } = value;
		req.validated = {
			...value,
			page,
			sort,
			quarter: value.quarter_id,
			...(value.sem && { semester_id: semester }),
			...(value.quarter_id && { quarter_id: quarter }),
		};
		next();
	}
}

export default new Auth();
