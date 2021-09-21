import { Request } from 'express';
import { QueryTypes } from 'sequelize';
import db from '../config/db';
import OutletService from './Outlet';

class Sales {
	getTarget(): string {

		let query =
			'SELECT SUM(st.target_sales) FROM ( SELECT * FROM mstr_sales_target  UNION SELECT * FROM mstr_sales_target2  UNION SELECT * FROM mstr_sales_target3  UNION SELECT * FROM mstr_sales_target4 ) AS st INNER JOIN mstr_outlet AS o ON o.outlet_id = st.outlet_id INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias  INNER JOIN ms_user_scope AS us ON o.outlet_id = us.scope  INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE st.outlet_id IS NOT NULL';
		
		return query
	}
	getAktual(): string {

		let query =
			'SELECT SUM(trb.sales) AS aktual FROM trx_transaksi tr INNER JOIN trx_transaksi_barang trb ON trb.kd_transaksi = tr.kd_transaksi INNER JOIN mstr_outlet o ON o.outlet_id = tr.no_id INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias  INNER JOIN ms_user_scope AS us ON o.outlet_id = us.scope INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL';

		return query
	}
	async getSalesByDistributor(req: Request) {
		let {
			outlet_id,
			area_id,
			wilayah_id,
			distributor_id,
			region_id,
			ass_id,
			asm_id,
			salesman_id,
		} = req.validated;
		const { scope, level } = req.body.decoded;
		let addWhere: string | null = null;
		let params: string[] = [];
		if (level === '4') addWhere = 'o.distributor_id';
		if (level === '2') addWhere = 'o.region_id';
		if (level === '3') addWhere = 'o.city_id_alias';
		if (level === '5') addWhere = 'o.outlet_id';

		let qTarget = this.getTarget();
		qTarget += ' AND o.`distributor_id` = d.`distributor_id`';
		let qAktual = this.getAktual();
		qAktual += ' AND o.`distributor_id` = d.`distributor_id`';

		let query =
			`SELECT d.distributor_name, d.distributor_id, (${qTarget}) AS target, (${qAktual}) AS aktual, (((${qAktual})/(${qTarget})) * 100) AS pencapaian FROM mstr_outlet AS o INNER JOIN mstr_distributor as d ON d.distributor_id = o.distributor_id WHERE d.distributor_id IS NOT NULL`;

		if (addWhere) {
			query += ' AND ' + addWhere + ' IN (?)';
			params.push(scope);
		}
		if (distributor_id) {
			query += ' AND o.distributor_id = ?';
			params.push(distributor_id);
		}
		if (region_id) {
			query += ' AND o.region_id = ?';
			params.push(region_id);
		}
		if (outlet_id) {
			query += ' AND o.outlet_id = ?';
			params.push(outlet_id);
		}
		if (area_id) {
			query += ' AND o.city_id_alias = ?';
			params.push(area_id);
		}
		if (wilayah_id) {
			query += ' AND r.head_region_id = ?';
			params.push(wilayah_id);
		}
		if (ass_id) {
			query += ' AND dp.ass_id = ?';
			params.push(ass_id);
		}
		if (asm_id) {
			query += ' AND dp.asm_id = ?';
			params.push(asm_id);
		}

		query += ' GROUP BY d.distributor_id ORDER BY pencapaian DESC LIMIT 5'

		return await db.query(query, {
			raw: true,
			type: QueryTypes.SELECT,
			replacements: params,
		});
	}
}

export default new Sales();
