import { Request, Response } from 'express';
import NumberFormat from '../helpers/NumberFormat';
import response from '../helpers/Response';
import Service from '../services/Sales';
import OService from '../services/Outlet';
import salesByHirarki from '../types/SalesInterface';
import SalesHelper from '../helpers/SalesHelper';

class Sales {
	// async get(req: Request, res: Response): Promise<object | undefined> {
	// 	try {
	// 		interface result {
	// 			aktual: number;
	// 			target: number;
	// 			total_outlet: number;
	// 			avg: number;
	// 			diff: number;
	// 			percentage: string;
	// 		}
	// 		let sales: result[] = await Service.getSummary(req);
	// 		sales = sales.map((val: any) => ({
	// 			...val,
	// 			avg: val.aktual / val.total_outlet,
	// 			diff: val.aktual - val.target,
	// 			percentage: ((val.aktual / val.target) * 100).toFixed(2) + ' %',
	// 		}));
	// 		sales = NumberFormat(sales, true, 'aktual', 'target', 'avg', 'diff');
	// 		return response(res, true, sales[0], null, 200);
	// 	} catch (error) {
	// 		return response(res, false, null, JSON.stringify(error), 500);
	// 	}
	// }

	// async getSummaryByRegion(
	// 	req: Request,
	// 	res: Response
	// ): Promise<object | undefined> {
	// 	try {
	// 		let aktual: number = 0,
	// 			outlet: number = 0,
	// 			target: number = 0;
	// 		let totalTarget = await Service.getTarget(req);
	// 		totalTarget = totalTarget[0].total || 0;
	// 		let totalOutlet = await OService.getOutletCount(req);
	// 		totalOutlet = totalOutlet[0].total || 0;
	// 		let data: salesByHirarki[] = await Service.getSummaryByRegion(req);
	// 		data.map((e: any) => {
	// 			aktual += e.aktual;
	// 			target += e.target;
	// 			outlet += e.outlet;
	// 		});
	// 		data = data.map((e: any) => ({
	// 			...e,
	// 			pencapaian: ((e.aktual / e.target) * 100).toFixed(2) + '%',
	// 			kontribusi: ((e.aktual / totalTarget) * 100).toFixed(2) + '%',
	// 			bobot_target: ((e.target / totalTarget) * 100).toFixed(2) + '%',
	// 			bobot_outlet: ((e.outlet / totalOutlet) * 100).toFixed(2) + '%',
	// 		}));
	// 		data = [
	// 			...data,
	// 			{
	// 				aktual,
	// 				target,
	// 				outlet,
	// 				region: 'Total Pencapaian',
	// 				pencapaian: ((aktual / target) * 100).toFixed(2) + '%',
	// 				kontribusi: ((aktual / totalTarget) * 100).toFixed(2) + '%',
	// 				bobot_target: ((target / totalTarget) * 100).toFixed(2) + '%',
	// 				bobot_outlet: ((outlet / totalOutlet) * 100).toFixed(2) + '%',
	// 			},
	// 		];
	// 		data = NumberFormat(data, true, 'aktual', 'target');
	// 		return response(res, true, data, null, 200);
	// 	} catch (error) {
	// 		return response(res, false, null, JSON.stringify(error), 500);
	// 	}
	// }
	async getSummaryByDistributor(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let data: any = await Service.getSalesByDistributor(req);
			data = await SalesHelper(req, data, 'distributor')
			return response(res, true, data, null, 200);
		} catch (error) {
			console.log(error)
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryByArea(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let data: any = await Service.getSalesByArea(req);
			data = await SalesHelper(req, data, 'city')
			return response(res, true, data, null, 200);
		} catch (error) {
			console.log(error)
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryByASM(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let data: any = await Service.getSalesByASM(req);
			data = await SalesHelper(req, data, 'nama_pic')
			return response(res, true, data, null, 200);
		} catch (error) {
			console.log(error)
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryByASS(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let data: any = await Service.getSalesByASS(req);
			data = await SalesHelper(req, data, 'nama_pic')
			return response(res, true, data, null, 200);
		} catch (error) {
			console.log(error)
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryByOutlet(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let data: any = await Service.getSalesByOutlet(req);
			data = await SalesHelper(req, data, 'outlet')
			return response(res, true, data, null, 200);
		} catch (error) {
			console.log(error)
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryByRegion(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let data: any = await Service.getSalesByRegion(req);
			data = await SalesHelper(req, data, 'region')
			return response(res, true, data, null, 200);
		} catch (error) {
			console.log(error)
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryByAchieve(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let data: any = await Service.getSalesByAchiev(req);
			data = data.map((e: any) => ({
				...e,
				aktual: +(e.aktual)
			}))
			// data = NumberFormat(data, true, 'aktual', 'target')
			data = await SalesHelper(req, data, 'cluster')
			return response(res, true, data, null, 200);
		} catch (error) {
			console.log(error)
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryPerQuarter(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let data: any = await Service.getSummaryPerQuarter(req);
			data = data.map((e: any) => ({
				...e,
				aktual: +(e.aktual)
			}))
			// data = NumberFormat(data, true, 'aktual', 'target')
			data = await SalesHelper(req, data, 'bulan')
			return response(res, true, data, null, 200);
		} catch (error) {
			console.log(error)
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryPerSemester(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let data: any = await Service.getSummaryPerSemester(req);
			data = data.map((e: any) => ({
				...e,
				aktual: +(e.aktual)
			}))
			// data = NumberFormat(data, true, 'aktual', 'target')
			data = await SalesHelper(req, data, 'kuartal')
			return response(res, true, data, null, 200);
		} catch (error) {
			console.log(error)
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryPerYear(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let data: any = await Service.getSummaryPerYear(req);
			data = data.map((e: any) => ({
				...e,
				aktual: +(e.aktual)
			}))
			// data = NumberFormat(data, true, 'aktual', 'target')
			data = await SalesHelper(req, data, 'kuartal')
			return response(res, true, data, null, 200);
		} catch (error) {
			console.log(error)
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryPerYears(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let data: any = await Service.getSummaryPerYears(req);
			data = data.map((e: any) => ({
				...e,
				kuartal: "Tahunan",
				aktual: +(e.aktual)
			}))
			// data = NumberFormat(data, true, 'aktual', 'target')
			data = await SalesHelper(req, data, 'kuartal', true)
			return response(res, true, data, null, 200);
		} catch (error) {
			console.log(error)
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
}

export default new Sales();
