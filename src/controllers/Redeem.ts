import { Request, Response } from 'express';
import NumberFormat from '../helpers/NumberFormat';
import response from '../helpers/Response';
import Service from '../services/Redeem';

class Redeem {
	async getproduct(req: Request, res: Response): Promise<object | undefined> {
		try {
			const point: any[] = await Service.getPoint(req);
			req.validated.point = point[0].perolehan;
			const data: any[] = await Service.getProduct(req);
			return response(res, true, data, null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error.message), 500);
		}
	}
	async post(req: Request, res: Response): Promise<object | undefined> {
		try {
			await Service.post(req);
			return response(res, true, 'Redeemption has been uploaded', null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error.message), 500);
		}
	}
	async checkout(req: Request, res: Response): Promise<object | undefined> {
		try {
			req.validated.product_id = req.validated.product.map(
				(e: any) => e.product_id
			);
			const products = await Service.getProduct(req);
			const result = req.validated.product.map((e: any) => ({
				...e,
				category: products.find((x: any) => x.product_id === e.product_id)
					.category,
			}));
			const temp: any[] = [];
			const valid: [] = result
				.filter((e: any) => e.category !== 'PULSA' && e.category !== 'EWALLET')
				.map((e: any) => ({ product_id: e.product_id, qty: e.qty }));
			const splitted = result
				.filter(
					(e: any) =>
						(e.category === 'PULSA' || e.category === 'EWALLET') && e.qty > 1
				)
				.map((e: any) => {
					for (let i = 0; i < e.qty; i++) {
						temp.push({ product_id: e.product_id, qty: 1 });
					}
				});
			// await Service.validation(req);
			return response(res, true, [...temp, ...valid], null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error.message), 500);
		}
	}
	async validation(req: Request, res: Response): Promise<object | undefined> {
		try {
			await Service.validation(req);
			return response(
				res,
				true,
				'Redeemption form has been validated',
				null,
				200
			);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error.message), 500);
		}
	}
	async getPointSummary(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let point = await Service.getPointSummary(req);
			point = NumberFormat(point, false, 'achieve', 'redeem');
			return response(res, true, point[0], null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error.message), 500);
		}
	}
	async getPointSummaryByHR(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let point: any[1] = await Service.getPointSummaryByHR(req);
			point = point.map((val: any) => ({
				...val,
				diff: val.achieve - val.redeem,
				percentage: ((val.redeem / val.achieve) * 100).toFixed(2) + '%',
			}));
			point = NumberFormat(point, false, 'achieve', 'redeem', 'diff');
			return response(res, true, point, null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error.message), 500);
		}
	}
}
// result redeem tidak sama, karna join ke outlet
export default new Redeem();
