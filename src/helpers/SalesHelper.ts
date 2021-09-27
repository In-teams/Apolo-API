import { Request } from 'express';
import Service from '../services/Sales';
import NumberFormat from './NumberFormat';

class SalesHelper {
	async index(req: Request, data: any[], type: string) {
		let aktual: number = 0,
			outlet: number = 0,
			target: number = 0;
		let totalTarget: any = await Service.getTarget(req);
		totalTarget = totalTarget[0].target || 0;
		let totalOutlet: any = await Service.getOutletCount(req);
		totalOutlet = totalOutlet[0].total || 0;
		data.map((e: any) => {
			aktual += +e.aktual;
			target += e.target;
			outlet += e.outlet;
		});
		data = data.map((e: any) => ({
			...e,
			aktual: + e.aktual,
			pencapaian: e.pencapaian ? e.pencapaian + '%' : ((e.aktual / e.target) * 100).toFixed(2) + '%',
			kontribusi: ((+e.aktual / totalTarget) * 100).toFixed(2) + '%',
			bobot_target: ((e.target / totalTarget) * 100).toFixed(2) + '%',
			bobot_outlet: ((e.outlet / totalOutlet) * 100).toFixed(2) + '%',
		}));
        data = [
            ...data,
            {
                aktual,
                target,
                outlet,
                [type]: 'Total Pencapaian',
                pencapaian: ((aktual / target) * 100).toFixed(2) + '%',
                kontribusi: ((aktual / totalTarget) * 100).toFixed(2) + '%',
                bobot_target: ((target / totalTarget) * 100).toFixed(2) + '%',
                bobot_outlet: ((outlet / totalOutlet) * 100).toFixed(2) + '%',
            },
        ];
        data = NumberFormat(data, true, 'aktual', 'target');
        return data
	}
}

export default new SalesHelper().index;
