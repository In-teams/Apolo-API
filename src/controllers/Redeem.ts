import { Request, Response } from 'express';
import DateFormat from '../helpers/DateFormat';
import IncrementNumber from '../helpers/IncrementNumber';
import NumberFormat from '../helpers/NumberFormat';
import response from '../helpers/Response';
import Service from '../services/Redeem';

class Redeem {
	// async getproduct(req: Request, res: Response): Promise<object | undefined> {
	// 	try {
	// 		const point: any[] = await Service.getPoint(req);
	// 		req.validated.point = point[0].perolehan;
	// 		const data: any[] = await Service.getProduct(req);
	// 		return response(res, true, data, null, 200);
	// 	} catch (error) {
	// 		return response(res, false, null, JSON.stringify(error), 500);
	// 	}
	// }
	// async post(req: Request, res: Response): Promise<object | undefined> {
	// 	try {
	// 		await Service.post(req);
	// 		return response(res, true, 'Redeemption has been uploaded', null, 200);
	// 	} catch (error) {
	// 		return response(res, false, null, JSON.stringify(error), 500);
	// 	}
	// }
	// async checkout(req: Request, res: Response): Promise<object | undefined> {
	// 	try {
	// 		req.validated.product_id = req.validated.product.map(
	// 			(e: any) => e.product_id
	// 		);
	// 		const products = await Service.getProduct(req);
	// 		const filtered = req.validated.product.map((e: any) => ({
	// 			...e,
	// 			category: products.find((x: any) => x.product_id === e.product_id)
	// 				.category,
	// 			nama_produk: products.find((x: any) => x.product_id === e.product_id)
	// 				.product_name,
	// 			point: products.find((x: any) => x.product_id === e.product_id).point,
	// 		}));
	// 		let TrCode: any[] | string = await Service.getLastTrCode();
	// 		TrCode = IncrementNumber(TrCode[0].kd_transaksi);
	// 		let temp: any[] = [];
	// 		const valid: [] = filtered
	// 			.filter((e: any) => e.category !== 'PULSA' && e.category !== 'EWALLET')
	// 			.map((e: any) => ({ ...e }));
	// 		filtered
	// 			.filter((e: any) => e.category === 'PULSA' || e.category === 'EWALLET')
	// 			.map((e: any) => {
	// 				for (let i = 0; i < e.quantity; i++) {
	// 					temp.push({ ...e, quantity: 1 });
	// 				}
	// 			});

	// 		let total = 0;
	// 		const result = [...temp, ...valid].map((e: any) => {
	// 			const data: object = {
	// 				kd_transaksi: TrCode,
	// 				tgl_transaksi: DateFormat.getToday('YYYY-MM-DD'),
	// 				no_batch: 'MS',
	// 				program_id: 'MON-001',
	// 				no_id: req.validated.outlet_id,
	// 				status: 'R',
	// 				kd_produk: e.product_id,
	// 				nama_produk: e.nama_produk,
	// 				quantity: e.quantity,
	// 				point_satuan: e.point,
	// 			};
	// 			TrCode = IncrementNumber(TrCode);
	// 			total = total + e.point * e.quantity;
	// 			return data;
	// 		});

	// 		req.validated.data = result.map((e: any) => ({
	// 			kd_transaksi: e.kd_transaksi,
	// 			tgl_transaksi: e.tgl_transaksi,
	// 			no_batch: e.no_batch,
	// 			program_id: e.program_id,
	// 			no_id: e.no_id,
	// 			status: e.status,
	// 		}));
	// 		req.validated.detail = result.map((e: any) => ({
	// 			kd_transaksi: e.kd_transaksi,
	// 			kd_produk: e.kd_produk,
	// 			nama_produk: e.nama_produk,
	// 			quantity: e.quantity,
	// 			point_satuan: e.point_satuan,
	// 		}));

	// 		const point = await Service.getPoint(req);
	// 		const pointRedeem = await Service.getPointRedeem(req);
	// 		if (total > (point[0].perolehan - pointRedeem[0].redeem))
	// 			return response(res, false, null, 'poin tidak cukup', 400);
	// 		await Service.checkout(req);
	// 		return response(res, true, 'Checkout berhasil', null, 200);
	// 	} catch (error) {
	// 		return response(res, false, null, JSON.stringify(error), 500);
	// 	}
	// }
	// async validation(req: Request, res: Response): Promise<object | undefined> {
	// 	try {
	// 		await Service.validation(req);
	// 		return response(
	// 			res,
	// 			true,
	// 			'Redeemption form has been validated',
	// 			null,
	// 			200
	// 		);
	// 	} catch (error) {
	// 		return response(res, false, null, JSON.stringify(error), 500);
	// 	}
	// }
	async getPointSummary(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let point = await Service.getPointSummary(req);
            point = point.map((e: any) => ({
                ...e,
                achieve: +e.achieve,
                redeem: +e.redeem,
            }))
			point = NumberFormat(point, false, 'achieve', 'redeem');
			return response(res, true, point[0], null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	// async getPointSummaryByHR(
	// 	req: Request,
	// 	res: Response
	// ): Promise<object | undefined> {
	// 	try {
	// 		let point: any[1] = await Service.getPointSummaryByHR(req);
	// 		point = point.map((val: any) => ({
	// 			...val,
	// 			diff: val.achieve - val.redeem,
	// 			percentage: ((val.redeem / val.achieve) * 100).toFixed(2) + '%',
	// 		}));
	// 		point = NumberFormat(point, false, 'achieve', 'redeem', 'diff');
	// 		return response(res, true, point, null, 200);
	// 	} catch (error) {
	// 		return response(res, false, null, JSON.stringify(error), 500);
	// 	}
	// }
}
// result redeem tidak sama, karna join ke outlet
export default new Redeem();
