import { Request } from 'express';
import { QueryTypes } from 'sequelize';
import db from '../config/db';
import filterParams from '../helpers/filterParams';
import salesByHirarki from '../types/SalesInterface';
import OutletService from './Outlet';

const queryTarget =
	'SELECT SUM(st.target_sales) AS target FROM ( SELECT * FROM mstr_sales_target UNION SELECT * FROM mstr_sales_target2 UNION SELECT * FROM mstr_sales_target3 UNION SELECT * FROM mstr_sales_target4 ) AS st INNER JOIN mstr_outlet AS o ON o.outlet_id = st.outlet_id INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE st.outlet_id IS NOT NULL';

const queryAktual =
	'SELECT SUM(trb.sales) AS aktual FROM trx_transaksi tr INNER JOIN trx_transaksi_barang trb ON trb.kd_transaksi = tr.kd_transaksi INNER JOIN mstr_outlet o ON o.outlet_id = tr.no_id INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL';

class Sales {
	async getOutletCount(req: Request): Promise<{ target: number }[]> {
		let query =
			'SELECT COUNT(DISTINCT o.outlet_id) AS total FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS r ON o.`region_id` = r. `pulau_id_alias` INNER JOIN ms_dist_pic AS pic ON o.`distributor_id` = pic.`distributor_id` WHERE o.`outlet_id` IS NOT NULL';
		let { query: newQuery, params } = filterParams(req, query);

		return await db.query(newQuery, {
			raw: true,
			type: QueryTypes.SELECT,
			replacements: params,
		});
	}
	async getTarget(req: Request): Promise<{ target: number }[]> {
		let { query: newQuery, params } = filterParams(req, queryTarget);

		return await db.query(newQuery, {
			raw: true,
			type: QueryTypes.SELECT,
			replacements: params,
		});
	}
	async getSalesByDistributor(req: Request): Promise<salesByHirarki[]> {
		const { sort } = req.validated;
		let qTarget = queryTarget + ' AND o.`distributor_id` = d.`distributor_id`';
		let qAktual = queryAktual + ' AND o.`distributor_id` = d.`distributor_id`';

		let query = `SELECT d.distributor_name, d.distributor_id, (${qTarget}) AS target, (${qAktual}) AS aktual, (CONCAT(TRUNCATE(((${qAktual})/(${qTarget})* 100), 2 ), '%')) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN mstr_distributor as d ON d.distributor_id = o.distributor_id WHERE d.distributor_id IS NOT NULL`;

		let { query: newQuery, params }: { query: string; params: string[] } =
			filterParams(req, query);
		// params.push(sort)

		newQuery += ` GROUP BY d.distributor_id ORDER BY pencapaian ${sort} LIMIT 5`;

		return await db.query(newQuery, {
			raw: true,
			type: QueryTypes.SELECT,
			replacements: params,
		});

		// const {sort} = req.validated
		// let qTarget = queryTarget + ' AND o.`distributor_id` = d.`distributor_id`';
		// let qAktual = queryAktual + ' AND o.`distributor_id` = d.`distributor_id`';

		// let { query: gTarget, params: pTarget }: {query: string, params: string[]} = filterParams(req, queryTarget);
		// let query = `SELECT d.distributor_name, d.distributor_id, (${qTarget}) AS target, (${qAktual}) AS aktual, (CONCAT(TRUNCATE(((${qAktual})/(${qTarget})* 100), 2 ), '%')) AS pencapaian, (CONCAT(TRUNCATE(((${qAktual})/(${gTarget})* 100), 2 ), '%')) AS kontribusi FROM mstr_outlet AS o INNER JOIN mstr_distributor as d ON d.distributor_id = o.distributor_id WHERE d.distributor_id IS NOT NULL`;

		// let { query: newQuery, params }: {query: string, params: string[]} = filterParams(req, query);
		// // params.push(sort)

		// newQuery += ` GROUP BY d.distributor_id ORDER BY pencapaian ${sort} LIMIT 5`;

		// return await db.query(newQuery, {
		// 	raw: true,
		// 	type: QueryTypes.SELECT,
		// 	replacements: [...pTarget, ...params],
		// });
	}
}

export default new Sales();
