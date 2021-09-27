import { NextFunction, Request, Response } from 'express';
import joi from 'joi';
import response from '../helpers/Response';
import appHelper from '../helpers/App';

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
		let quarter: string[] | undefined = value.quarter_id
			? appHelper.getMonthIdByQuarter(value.quarter_id)
			: undefined;
		let semester: number[] | undefined = value.sem
			? appHelper.getMonthIdBySemester(value.sem)
			: undefined;
		const { page = 1, sort = 'ASC' } = value;
		req.validated = {
			...value,
			page,
			sort,
			quarter: value.quarter_id,
			month: appHelper.getMonthName(value.month),
			month_id: value.month,
			...(value.sem && { semester_id: semester }),
			...(value.quarter_id && { quarter_id: quarter }),
		};
		next();
	}
}

export default new Auth();
