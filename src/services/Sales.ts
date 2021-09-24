import { Request } from 'express';
import { QueryTypes } from 'sequelize';
import db from '../config/db';
import filterParams from '../helpers/FilterParams';
import salesByHirarki from '../types/SalesInterface';
import OutletService from './Outlet';

const queryTarget: string =
	'SELECT SUM(st.target_sales) AS target FROM ( SELECT * FROM mstr_sales_target UNION SELECT * FROM mstr_sales_target2 UNION SELECT * FROM mstr_sales_target3 UNION SELECT * FROM mstr_sales_target4 ) AS st INNER JOIN mstr_outlet AS o ON o.outlet_id = st.outlet_id INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON o.distributor_id = pic.distributor_id INNER JOIN ms_bulan AS b ON b.bulan = st.month_target WHERE st.outlet_id IS NOT NULL';
let queryTargetByOutlet: string =
	'SELECT SUM(st.target_sales) AS target, st.outlet_id, b.id AS bulan FROM ( SELECT * FROM mstr_sales_target UNION SELECT * FROM mstr_sales_target2 UNION SELECT * FROM mstr_sales_target3 UNION SELECT * FROM mstr_sales_target4 ) AS st INNER JOIN mstr_outlet AS o ON o.outlet_id = st.outlet_id INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON o.distributor_id = pic.distributor_id INNER JOIN ms_bulan AS b ON b.bulan = st.month_target WHERE st.outlet_id IS NOT NULL';

const queryAktual: string =
	'SELECT SUM(trb.sales) AS aktual FROM trx_transaksi tr INNER JOIN trx_transaksi_barang trb ON trb.kd_transaksi = tr.kd_transaksi INNER JOIN mstr_outlet AS o ON o.outlet_id = tr.no_id INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON o.distributor_id = pic.distributor_id WHERE o.outlet_id IS NOT NULL';

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
		let qTarget = queryTarget + ' AND o.`distributor_id` = d.`distributor_id`';
		let qAktual = queryAktual + ' AND o.`distributor_id` = d.`distributor_id`';

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
		let qTarget = queryTarget + ' AND o.city_id_alias = ci.city_id_alias';
		let qAktual = queryAktual + ' AND o.city_id_alias = ci.city_id_alias';

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
		let qTarget = queryTarget + ' AND o.outlet_id = o.outlet_id';
		let qAktual = queryAktual + ' AND o.outlet_id = o.outlet_id';

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
		let qTarget = queryTarget + ' AND o.region_id = reg.pulau_id_alias';
		let qAktual = queryAktual + ' AND o.region_id = reg.pulau_id_alias';

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
	async getSalesByASS(req: Request): Promise<salesByHirarki[]> {
		const { sort } = req.validated;
		let qTarget = queryTarget + ' AND pic.ass_id = mp.kode_pic';
		let qAktual = queryAktual + ' AND pic.ass_id = mp.kode_pic';

		let { query: qt, params: pt } = filterParams.target(req, qTarget);
		let { query: qa, params: pa } = filterParams.aktual(req, qAktual);

		let query = `SELECT mp.nama_pic as nama_pic, (${qt}) AS target, (${qa}) AS aktual, (CONCAT(TRUNCATE(((${qa})/(${qt})* 100), 2 ), '%')) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_pic as mp ON mp.kode_pic = dp.ass_id WHERE mp.kode_pic IS NOT NULL`;

		let { query: newQuery, params }: { query: string; params: string[] } =
			filterParams.query(req, query);

		newQuery += ` GROUP BY mp.kode_pic ORDER BY pencapaian ${sort} LIMIT 5`;

		return await db.query(newQuery, {
			raw: true,
			type: QueryTypes.SELECT,
			replacements: [...pt, ...pa, ...pt, ...pa, ...params],
		});
	}
	async getSalesByAchiev(req: Request) {
		let { query: qt, params: pt } = filterParams.target(
			req,
			queryTargetByOutlet
		);

		qt += ' GROUP BY outlet_id';
		let query = `SELECT mst.target, o.outlet_id, SUM(trb.sales) AS sales, CASE WHEN ROUND((SUM(trb.sales) / mst.target) * 100, 5) < 25 OR trb.sales IS NULL THEN '0% - 25%' WHEN ROUND((SUM(trb.sales) / mst.target) * 100, 5) >= 25 AND ROUND((SUM(trb.sales) / mst.target) * 100, 5) < 50 THEN '25% - 50%' WHEN ROUND((SUM(trb.sales) / mst.target) * 100, 5) >= 50 AND ROUND((SUM(trb.sales) / mst.target) * 100, 5) < 75 THEN '50% - 75%' WHEN ROUND((SUM(trb.sales) / mst.target) * 100, 5) >= 75 AND ROUND((SUM(trb.sales) / mst.target) * 100, 5) < 95 THEN '75% - 95%' WHEN ROUND((SUM(trb.sales) / mst.target) * 100, 5) >= 95 AND ROUND((SUM(trb.sales) / mst.target) * 100, 5) < 100 THEN '95 - 100%' ELSE '>= 100%' END AS cluster FROM mstr_outlet AS o LEFT JOIN trx_transaksi AS tr ON tr.no_id = o.outlet_id INNER JOIN ms_dist_pic AS pic ON o.distributor_id = pic.distributor_id INNER JOIN ms_pulau_alias AS r ON o. region_id = r.pulau_id_alias INNER JOIN ms_head_region AS hr ON r.head_region_id = hr.head_region_id LEFT JOIN trx_transaksi_barang AS trb ON trb.kd_transaksi = tr.kd_transaksi INNER JOIN (${qt}) AS mst ON mst.outlet_id = o.outlet_id WHERE o.outlet_id IS NOT NULL`;
		
		let {query: newQ, params: newP} =  filterParams.aktual(req, query)
		newQ += ' GROUP BY outlet_id';

		let newQuery = `SELECT cluster, SUM(target) AS target, SUM(sales) AS aktual, COUNT(outlet_id) AS outlet FROM (${newQ}) AS custom GROUP BY cluster`
		
		return await db.query(newQuery, {
			raw: true,
			type: QueryTypes.SELECT,
			replacements: [...pt, ...newP],
		});
	}
}

export default new Sales();
