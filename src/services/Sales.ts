import { Request } from 'express';
import { QueryTypes } from 'sequelize';
import db from '../config/db';
import filterParams from '../helpers/FilterParams';
import salesByHirarki from '../types/SalesInterface';
import OutletService from './Outlet';

const queryTarget: string =
	'SELECT SUM(st.target_sales) AS target FROM ( SELECT * FROM mstr_sales_target UNION SELECT * FROM mstr_sales_target2 UNION SELECT * FROM mstr_sales_target3 UNION SELECT * FROM mstr_sales_target4 ) AS st INNER JOIN mstr_outlet AS ou ON ou.outlet_id = st.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_bulan AS b ON b.bulan = st.month_target WHERE st.outlet_id IS NOT NULL';

const queryAktual: string =
	'SELECT SUM(trb.sales) AS aktual FROM trx_transaksi tr INNER JOIN trx_transaksi_barang trb ON trb.kd_transaksi = tr.kd_transaksi INNER JOIN mstr_outlet ou ON ou.outlet_id = tr.no_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id WHERE ou.outlet_id IS NOT NULL';

class Sales {
	async getOutletCount(req: Request): Promise<{ target: number }[]> {
		let query =
			'SELECT COUNT(DISTINCT o.outlet_id) AS total FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS r ON o.`region_id` = r. `pulau_id_alias` INNER JOIN ms_dist_pic AS pic ON o.`distributor_id` = pic.`distributor_id` WHERE o.`outlet_id` IS NOT NULL';
		let { query: newQuery, params } = filterParams.query(req, query);

		return await db.query(newQuery, {
			raw: true,
			type: QueryTypes.SELECT,
			replacements: params,
		});
	}
	async getTarget(req: Request): Promise<{ target: number }[]> {
		let query =
			'SELECT SUM(st.target_sales) AS target FROM ( SELECT * FROM mstr_sales_target UNION SELECT * FROM mstr_sales_target2 UNION SELECT * FROM mstr_sales_target3 UNION SELECT * FROM mstr_sales_target4 ) AS st INNER JOIN mstr_outlet AS o ON o.outlet_id = st.outlet_id INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_bulan AS b ON b.bulan = st.month_target WHERE st.outlet_id IS NOT NULL';
		let { query: q, params: p } = filterParams.target(req, query);
		let { query: newQuery, params } = filterParams.query(req, q);

		return await db.query(newQuery, {
			raw: true,
			type: QueryTypes.SELECT,
			replacements: [...p, ...params],
		});
	}
	async getSalesByDistributor(req: Request): Promise<salesByHirarki[]> {
		const { sort } = req.validated;
		let qTarget = queryTarget + ' AND ou.`distributor_id` = d.`distributor_id`';
		let qAktual = queryAktual + ' AND ou.`distributor_id` = d.`distributor_id`';

		let { query: qt, params: pt } = filterParams.target(req, qTarget);
		let { query: qa, params: pa } = filterParams.aktual(req, qAktual);

		let query = `SELECT d.distributor_name as distributor, d.distributor_id, (${qt}) AS target, (${qa}) AS aktual, (TRUNCATE(((${qa})/(${qt})* 100), 2 )) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN mstr_distributor as d ON d.distributor_id = o.distributor_id INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE d.distributor_id IS NOT NULL`;

		let { query: newQuery, params }: { query: string; params: string[] } =
			filterParams.query(req, query);

		newQuery += ` GROUP BY d.distributor_id ORDER BY pencapaian ${sort} LIMIT 5`;

		return await db.query(newQuery, {
			raw: true,
			type: QueryTypes.SELECT,
			replacements: [...pt, ...pa, ...pt, ...pa, ...params],
		});
	}
	async getSalesByArea(req: Request): Promise<salesByHirarki[]> {
		const { sort } = req.validated;
		let qTarget = queryTarget + ' AND ou.city_id_alias = ci.city_id_alias';
		let qAktual = queryAktual + ' AND ou.city_id_alias = ci.city_id_alias';

		let { query: qt, params: pt } = filterParams.target(req, qTarget);
		let { query: qa, params: pa } = filterParams.aktual(req, qAktual);

		let query = `SELECT ci.city_name_alias as city, (${qt}) AS target, (${qa}) AS aktual, (CONCAT(TRUNCATE(((${qAktual})/(${qt})* 100), 2 ), '%')) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN ms_city_alias as ci ON ci.city_id_alias = o.city_id_alias INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE ci.city_id_alias IS NOT NULL`;

		let { query: newQuery, params }: { query: string; params: string[] } =
			filterParams.query(req, query);

		newQuery += ` GROUP BY ci.city_id_alias ORDER BY pencapaian ${sort} LIMIT 5`;

		return await db.query(newQuery, {
			raw: true,
			type: QueryTypes.SELECT,
			replacements: [...pt, ...pa, ...pt, ...pa, ...params],
		});
	}
	async getSalesByOutlet(req: Request): Promise<salesByHirarki[]> {
		const { sort } = req.validated;
		let qTarget = queryTarget + ' AND ou.outlet_id = o.outlet_id';
		let qAktual = queryAktual + ' AND ou.outlet_id = o.outlet_id';

		let { query: qt, params: pt } = filterParams.target(req, qTarget);
		let { query: qa, params: pa } = filterParams.aktual(req, qAktual);

		let query = `SELECT o.outlet_name as outlet_name, (${qt}) AS target, (${qa}) AS aktual, (CONCAT(TRUNCATE(((${qa})/(${qt})* 100), 2 ), '%')) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`;

		let { query: newQuery, params }: { query: string; params: string[] } =
			filterParams.query(req, query);

		newQuery += ` GROUP BY o.outlet_id ORDER BY pencapaian ${sort} LIMIT 5`;

		return await db.query(newQuery, {
			raw: true,
			type: QueryTypes.SELECT,
			replacements: [...pt, ...pa, ...pt, ...pa, ...params],
		});
	}
	async getSalesByRegion(req: Request): Promise<salesByHirarki[]> {
		const { sort } = req.validated;
		let qTarget = queryTarget + ' AND ou.region_id = reg.pulau_id_alias';
		let qAktual = queryAktual + ' AND ou.region_id = reg.pulau_id_alias';

		let { query: qt, params: pt } = filterParams.target(req, qTarget);
		let { query: qa, params: pa } = filterParams.aktual(req, qAktual);

		let query = `SELECT reg.nama_pulau_alias AS region, (${qt}) AS target, (${qa}) AS aktual, (CONCAT(TRUNCATE(((${qa})/(${qt})* 100), 2 ), '%')) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE reg.pulau_id_alias IS NOT NULL`;

		let { query: newQuery, params }: { query: string; params: string[] } =
			filterParams.query(req, query);

		newQuery += ` GROUP BY reg.pulau_id_alias ORDER BY pencapaian ${sort} LIMIT 5`;

		return await db.query(newQuery, {
			raw: true,
			type: QueryTypes.SELECT,
			replacements: [...pt, ...pa, ...pt, ...pa, ...params],
		});
	}
	async getSalesByASM(req: Request): Promise<salesByHirarki[]> {
		const { sort } = req.validated;
		let qTarget = queryTarget + ' AND pic.asm_id = mp.kode_pic';
		let qAktual = queryAktual + ' AND pic.asm_id = mp.kode_pic';

		let { query: qt, params: pt } = filterParams.target(req, qTarget);
		let { query: qa, params: pa } = filterParams.aktual(req, qAktual);

		let query = `SELECT mp.nama_pic as nama_pic, (${qt}) AS target, (${qa}) AS aktual, (CONCAT(TRUNCATE(((${qa})/(${qt})* 100), 2 ), '%')) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_pic as mp ON mp.kode_pic = dp.asm_id WHERE mp.kode_pic IS NOT NULL`;

		let { query: newQuery, params }: { query: string; params: string[] } =
			filterParams.query(req, query);

		newQuery += ` GROUP BY mp.kode_pic ORDER BY pencapaian ${sort} LIMIT 5`;

		return await db.query(newQuery, {
			raw: true,
			type: QueryTypes.SELECT,
			replacements: [...pt, ...pa, ...pt, ...pa, ...params],
		});
	}
}

export default new Sales();
