import e, { Request, Response } from 'express';
import NumberFormat from '../helpers/NumberFormat';
import response from '../helpers/Response';
import Service from '../services/Sales';

class Sales {
	async get(req: Request, res: Response): Promise<object | undefined> {
		try {
			interface result {
				aktual: number;
				target: number;
				total_outlet: number;
				avg: number;
				diff: number;
				percentage: string;
			}
			let sales: result[] = await Service.getSummary(req);
			sales = sales.map((val: any) => ({
				...val,
				avg: val.aktual / val.total_outlet,
				diff: val.aktual - val.target,
				percentage: ((val.aktual / val.target) * 100).toFixed(2) + ' %',
			}));
			sales = NumberFormat(sales, true, 'aktual', 'target', 'avg', 'diff');
			return response(res, true, sales[0], null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}

	async getSummaryByRegion(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			interface result {
				aktual: number;
				outlet: number;
				target: number;
				region: string;
				pencapaian: string;
				kontribusi: string;
			}
			let aktual: number = 0,
				outlet: number = 0,
				target: number = 0;
			let total = await Service.getTarget(req);
			total = total[0].total || 0;
			let data: result[] = await Service.getSummaryByRegion(req);
			data.map((e: any) => {
				aktual += e.aktual;
				target += e.target;
				outlet += e.outlet;
			});
			data = data.map((e: any) => ({
				...e,
				pencapaian: ((e.aktual / total) * 100).toFixed(2) + '%',
				kontribusi: ((e.outlet / outlet) * 100).toFixed(2) + '%',
			}));
			data = [
				...data,
				{
					aktual,
					target,
					outlet,
					region: 'Total Pencapaian',
					pencapaian: ((aktual / total) * 100).toFixed(2) + '%',
					kontribusi: ((outlet / outlet) * 100).toFixed(2) + '%',
				},
			];
			data = NumberFormat(data, true, 'aktual', 'target');
			return response(res, true, data, null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryByDistributor(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			interface result {
				aktual: number;
				outlet: number;
				target: number;
				distributor: string;
				pencapaian: string;
				kontribusi: string;
			}
			let aktual: number = 0,
				outlet: number = 0,
				target: number = 0;
			let total = await Service.getTarget(req);
			total = total[0].total || 0;
			let data: result[] = await Service.getSummaryByDistributor(req);
			data.map((e: any) => {
				aktual += e.aktual;
				target += e.target;
				outlet += e.outlet;
			});
			data = data.map((e: any) => ({
				...e,
				pencapaian: ((e.aktual / total) * 100).toFixed(2) + '%',
				kontribusi: ((e.outlet / outlet) * 100).toFixed(2) + '%',
			}));
			data = [
				...data,
				{
					aktual,
					target,
					outlet,
					distributor: 'Total Pencapaian',
					pencapaian: ((aktual / total) * 100).toFixed(2) + '%',
					kontribusi: ((outlet / outlet) * 100).toFixed(2) + '%',
				},
			];
			data = NumberFormat(data, true, 'aktual', 'target');
			return response(res, true, data, null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryByArea(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			interface result {
				aktual: number;
				outlet: number;
				target: number;
				area: string;
				pencapaian: string;
				kontribusi: string;
			}
			let aktual: number = 0,
				outlet: number = 0,
				target: number = 0;
			let total = await Service.getTarget(req);
			total = total[0].total || 0;
			let data: result[] = await Service.getSummaryByArea(req);
			data.map((e: any) => {
				aktual += e.aktual;
				target += e.target;
				outlet += e.outlet;
			});
			data = data.map((e: any) => ({
				...e,
				pencapaian: ((e.aktual / total) * 100).toFixed(2) + '%',
				kontribusi: ((e.outlet / outlet) * 100).toFixed(2) + '%',
			}));
			data = [
				...data,
				{
					aktual,
					target,
					outlet,
					area: 'Total Pencapaian',
					pencapaian: ((aktual / total) * 100).toFixed(2) + '%',
					kontribusi: ((outlet / outlet) * 100).toFixed(2) + '%',
				},
			];
			data = NumberFormat(data, true, 'aktual', 'target');
			return response(res, true, data, null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryByHR(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			interface result {
				aktual: number;
				target: number;
			}
			let data: result[] = await Service.getSummaryByHR(req);
			data = NumberFormat(data, true, 'aktual', 'target');
			return response(res, true, data, null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryByASM(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			interface result {
				nama_pic: string;
				aktual: number;
				outlet: number;
				target: number;
				pencapaian: string;
				kontribusi: string;
			}
			let total = await Service.getTarget(req);
			total = total[0].total || 0;
			let data: result[] = await Service.getSummaryByASM(req);
			let aktual: number = 0,
				outlet: number = 0,
				target: number = 0;
			data.map((e: any) => {
				aktual += e.aktual;
				target += e.target;
				outlet += e.outlet;
			});

			// console.log(aktual, target)

			data = data.map((e: any) => ({
				...e,
				pencapaian: ((e.aktual / total) * 100).toFixed(2) + '%',
				kontribusi: ((e.outlet / outlet) * 100).toFixed(2) + '%',
			}));
			data = [
				...data,
				{
					nama_pic: 'Total Pencapaian',
					aktual,
					outlet,
					target,
					kontribusi: ((outlet / outlet) * 100).toFixed(2) + '%',
					pencapaian: ((aktual / total) * 100).toFixed(2) + '%',
				},
			];
			data = NumberFormat(data, true, 'aktual', 'target');
			return response(res, true, data, null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryByASS(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			interface result {
				nama_pic: string;
				aktual: number;
				outlet: number;
				target: number;
				pencapaian: string;
				kontribusi: string;
			}
			let total = await Service.getTarget(req);
			total = total[0].total || 0;
			let data: result[] = await Service.getSummaryByASS(req);
			let aktual: number = 0,
				outlet: number = 0,
				target: number = 0;
			data.map((e: any) => {
				aktual += e.aktual;
				target += e.target;
				outlet += e.outlet;
			});

			// console.log(aktual, target)

			data = data.map((e: any) => ({
				...e,
				pencapaian: ((e.aktual / total) * 100).toFixed(2) + '%',
				kontribusi: ((e.outlet / outlet) * 100).toFixed(2) + '%',
			}));
			data = [
				...data,
				{
					nama_pic: 'Total Pencapaian',
					aktual,
					outlet,
					target,
					kontribusi: ((outlet / outlet) * 100).toFixed(2) + '%',
					pencapaian: ((aktual / total) * 100).toFixed(2) + '%',
				},
			];
			data = NumberFormat(data, true, 'aktual', 'target');
			return response(res, true, data, null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	
	async getSummaryByAchieve(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let data: any[1] = await Service.getSummaryByAchieve(req);
			let aktual: number = 0,
				target: number = 0,
				outlet: number = 0;
			data.map((e: any) => {
				aktual += e.aktual;
				target += e.target;
				outlet += e.outlet;
			});

			data = data.map((e: any) => ({
				...e,
				bobot: ((e.aktual / target) * 100).toFixed(2) + '%',
				kontribusi: ((e.outlet / outlet) * 100).toFixed(2) + '%',
			}));
			data = [
				...data,
				{
					cluster: 'Total Pencapaian',
					aktual,
					target,
					outlet,
					bobot: ((aktual / target) * 100).toFixed(2) + '%',
					kontribusi: '100%',
				},
			];
			data = NumberFormat(data, true, 'aktual', 'target');
			return response(res, true, data, null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryPerQuarter(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let data: any[1] = await Service.getSummaryPerQuarter(req);
			let aktual: number = 0,
				target: number = 0,
				poin: number = 0;
			data.map((e: any) => {
				aktual += e.aktual;
				target += e.target;
				poin += e.poin;
			});

			data = data.map((e: any) => ({
				...e,
				bobot: ((e.aktual / target) * 100).toFixed(2) + '%',
				// progress: ((e.outlet / outlet) * 100).toFixed(2) + '%',
			}));
			data = [
				...data,
				{
					bulan: `Kuartal ${req.validated.quarter}`,
					aktual,
					target,
					poin,
					// poin: aktual / 100000,
					// outlet,
					bobot: ((aktual / target) * 100).toFixed(2) + '%',
				},
			];
			data = NumberFormat(data, true, 'aktual', 'target');
			data = NumberFormat(data, false, 'poin');
			return response(res, true, data, null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryPerSemester(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			if (!req.validated.semester_id)
				return response(res, false, null, 'sem is required', 400);
			let data: any[1] = await Service.getSummaryPerSemester(req);
			data = data.map((e: any) => ({
				...e,
				kuartal: `Kuartal ${e.kuartal}`,
				bobot: ((e.aktual / e.target) * 100).toFixed(2) + '%',
			}));
			data = NumberFormat(data, true, 'aktual', 'target');
			data = NumberFormat(data, false, 'poin');
			return response(res, true, data, null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryPerYear(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let data: any[1] = await Service.getSummaryPerYear(req);
			data = data.map((e: any) => ({
				...e,
				kuartal: `Semester ${e.kuartal}`,
				bobot: ((e.aktual / e.target) * 100).toFixed(2) + '%',
			}));
			data = NumberFormat(data, true, 'aktual', 'target');
			data = NumberFormat(data, false, 'poin');
			return response(res, true, data, null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
	async getSummaryPerYears(
		req: Request,
		res: Response
	): Promise<object | undefined> {
		try {
			let data: any[1] = await Service.getSummaryByYear(req);
			data = data.map((e: any) => ({
				...e,
				kuartal: 'Tahunan',
				bobot: ((e.aktual / e.target) * 100).toFixed(2) + '%',
			}));
			data = NumberFormat(data, true, 'aktual', 'target');
			data = NumberFormat(data, false, 'poin');
			return response(res, true, data, null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error), 500);
		}
	}
}

export default new Sales();
