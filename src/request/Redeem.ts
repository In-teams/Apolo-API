import { NextFunction, Request, Response } from 'express';
import joi from 'joi';
import FileSystem from '../helpers/FileSystem';
import GetFileExtention from '../helpers/GetFileExtention';
import response from '../helpers/Response';
import service from '../services/Redeem';
import appHelper from '../helpers/App';

class Redeem {
	// getProduct(req: Request, res: Response, next: NextFunction): any {
	// 	const schema = joi.object({
	// 		outlet_id: joi.string().required(),
	// 		category: joi.string(),
	// 	});

	// 	const { value, error } = schema.validate(req.query);
	// 	if (error) {
	// 		return response(res, false, null, error.message, 400);
	// 	}
	// 	req.validated = value;
	// 	next();
	// }
	get(req: Request, res: Response, next: NextFunction): any {
		const schema = joi.object({
			region_id: joi.string(),
			area_id: joi.string(),
			wilayah_id: joi.string(),
			outlet_id: joi.string(),
			distributor_id: joi.string(),
			ass_id: joi.string(),
			asm_id: joi.string(),
			salesman_id: joi.string(),
			sort: joi.string(),
			quarter_id: joi.number().valid(1, 2, 3, 4),
			sem: joi.number().valid(1, 2),
			month: joi.number().valid(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12),
		});

		const { value, error } = schema.validate(req.query);
		if (error) {
			return response(res, false, null, error.message, 400);
		}

		let quarter: number[] | undefined = value.quarter_id ? appHelper.getMonthIdByQuarter(value.quarter_id) : undefined;
		let semester: number[] | undefined = value.sem ? appHelper.getMonthIdBySemester(value.sem): undefined;
		req.validated = {
			...value,
			sort: value.sort || 'ASC',
			quarter: value.quarter_id,
			month: appHelper.getMonthName(value.month),
			month_id: value.month,
			...(value.sem && { semester_id: semester }),
			...(value.quarter_id && { quarter_id: quarter }),
		};
		next();
	}
	// async checkout(
	// 	req: Request,
	// 	res: Response,
	// 	next: NextFunction
	// ): Promise<any> {
	// 	try {
	// 		const schema = joi.object({
	// 			product: joi
	// 				.array()
	// 				.items(
	// 					joi.object({
	// 						product_id: joi.string().required(),
	// 						quantity: joi.number().required(),
	// 					})
	// 				)
	// 				.required(),
	// 			outlet_id: joi.string().required(),
	// 		});

	// 		const { value, error } = schema.validate(req.body);
	// 		if (error) {
	// 			return response(res, false, null, error.message, 400);
	// 		}

	// 		if (value.product.length < 1)
	// 			return response(res, false, null, 'must be value at least 1', 400);

	// 		req.validated = value;
	// 		const isUploaded = await service.getRedeemForm(req);
	// 		if (isUploaded.length < 1)
	// 			return response(res, false, null, 'reedemption is not uploaded', 400);
	// 		const { status_penukaran: status, id } = isUploaded[0];
	// 		if (status !== 7 && status !== 8)
	// 			return response(res, false, null, 'reedemption is not validated', 400);
	// 		req.validated.id = id;
	// 		next();
	// 	} catch (error) {
	// 		console.log(error, 'error request');
	// 	}
	// }
	// async validation(
	// 	req: Request,
	// 	res: Response,
	// 	next: NextFunction
	// ): Promise<any> {
	// 	try {
	// 		const schema = joi.object({
	// 			status_penukaran: joi.number().required(),
	// 			outlet_id: joi.string().required(),
	// 		});

	// 		const { value, error } = schema.validate(req.body);
	// 		if (error) {
	// 			return response(res, false, null, error.message, 400);
	// 		}

	// 		req.validated = value;
	// 		const isUploaded = await service.getRedeemForm(req);
	// 		if (isUploaded.length < 1)
	// 			return response(res, false, null, 'reedemption is not uploaded', 400);
	// 		const { status_penukaran: status, id } = isUploaded[0];
	// 		if (status === 7 || status === 8)
	// 			return response(res, false, null, 'reedemption was validated', 400);
	// 		req.validated.id = id;
	// 		next();
	// 	} catch (error) {
	// 		console.log(error, 'error request');
	// 	}
	// }
	// async post(req: Request, res: Response, next: NextFunction): Promise<any> {
	// 	try {
	// 		const schema = joi.object({
	// 			file: joi.string().base64().required(),
	// 			outlet_id: joi.string().required(),
	// 		});

	// 		const { value, error } = schema.validate(req.body);
	// 		if (error) {
	// 			return response(res, false, null, error.message, 400);
	// 		}

	// 		req.validated = value;
	// 		const ext = GetFileExtention(value.file);
	// 		const filename: string = `${Date.now()}-${value.outlet_id}${ext}`;
	// 		const path: string = pathRedeem + '/' + filename;
	// 		const wasUploaded: any[] = await service.getRedeemForm(req);
	// 		req.validated = { ...value, filename };
	// 		if (wasUploaded.length > 0) {
	// 			const { status_penukaran: status, filename: file, id } = wasUploaded[0];
	// 			if (status === 7 || status === 8) {
	// 				return response(
	// 					res,
	// 					false,
	// 					null,
	// 					'Redeemption form was validated',
	// 					400
	// 				);
	// 			} else {
	// 				await FileSystem.DeleteFile(`${pathRedeem}/${file}`);
	// 				await FileSystem.WriteFile(path, value.file, true);
	// 				req.validated.id = id;
	// 				delete req.validated.file;
	// 				await service.update(req);
	// 				return response(
	// 					res,
	// 					true,
	// 					'Redeem form has been replaced',
	// 					null,
	// 					200
	// 				);
	// 			}
	// 		}
	// 		await FileSystem.WriteFile(path, value.file, true);

	// 		next();
	// 	} catch (error) {
	// 		return response(res, false, null, JSON.stringify(error), 400);
	// 	}
	// }
}

export default new Redeem();
