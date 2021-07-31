import { Request, Response } from 'express';
import response from '../helpers/Response';

class App {
	async getMonth(req: Request, res: Response): Promise<object | undefined> {
		try {
			interface month {
				id: number | null;
				month: string;
			}
			let data: month[] = [
				{ id: 1, month: 'JANUARY' },
				{ id: 2, month: 'FEBRUARY' },
				{ id: 3, month: 'MARCH' },
				{ id: 4, month: 'APRIL' },
				{ id: 5, month: 'MAY' },
				{ id: 6, month: 'JUNE' },
				{ id: 7, month: 'JULY' },
				{ id: 8, month: 'AUGUST' },
				{ id: 9, month: 'SEPTEMBER' },
				{ id: 10, month: 'OCTOBER' },
				{ id: 11, month: 'NOVEMBER' },
				{ id: 12, month: 'DECEMBER' },
			];

			switch (req.validated.quarter_id) {
				case 1:
					data = data.slice(0, 3);
					break;
				case 2:
					data = data.slice(3, 6);
					break;
				case 3:
					data = data.slice(6, 9);
					break;
				case 4:
					data = data.slice(9, 12);
					break;

				default:
					data = data;
					break;
			}

			data = [{ id: null, month: 'ALL' }, ...data];

			return response(res, true, data, null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error.message), 500);
		}
	}
	async getQuarter(req: Request, res: Response): Promise<object | undefined> {
		try {
			const { month } = req.validated;
			interface q {
				id: number | null;
				quarter: string;
			}
			let data: q[] = [
				{ id: 1, quarter: 'QUARTER 1' },
				{ id: 2, quarter: 'QUARTER 2' },
				{ id: 3, quarter: 'QUARTER 3' },
				{ id: 4, quarter: 'QUARTER 4' },
			];

			if ([1, 2, 3].includes(month)) {
				data = data.slice(0, 1);
			} else if ([4, 5, 6].includes(month)) {
				data = data.slice(1, 2);
			} else if ([7, 8, 9].includes(month)) {
				data = data.slice(2, 3);
			} else if ([10, 11, 12].includes(month)) {
				data = data.slice(3, 4);
			}

			data = [{ id: null, quarter: 'ALL 1' }, ...data];

			return response(res, true, data, null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error.message), 500);
		}
	}
	async getYear(req: Request, res: Response): Promise<object | undefined> {
		try {
			const data: object[] = [
				{ id: 1, year: new Date().getFullYear() - 1 },
				{ id: 2, year: new Date().getFullYear() },
				{ id: 3, year: new Date().getFullYear() + 1 },
			];
			return response(res, true, data, null, 200);
		} catch (error) {
			return response(res, false, null, JSON.stringify(error.message), 500);
		}
	}
}

export default new App();
