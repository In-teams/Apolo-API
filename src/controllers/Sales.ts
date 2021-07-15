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
				diff: val.target - val.aktual,
				percentage: ((val.aktual / val.target) * 100).toFixed(2) + ' %',
			}));
			sales = NumberFormat(sales, true, 'aktual', 'target', 'avg', 'diff');
			return response(res, true, sales[0], null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error.message), 500);
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
			return response(res, false, null, JSON.stringify(error.message), 500);
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
				progress: ((e.outlet / outlet) * 100).toFixed(2) + '%',
			}));
			data = [
				...data,
				{
					cluster: 'Total Pencapaian',
					aktual,
					target,
					outlet,
					bobot: ((aktual / target) * 100).toFixed(2) + '%',
					progress: '100%',
				},
			];
			data = NumberFormat(data, true, 'aktual', 'target');
			return response(res, true, data, null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error.message), 500);
		}
	}
}

export default new Sales();
