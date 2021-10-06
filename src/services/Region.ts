import { Request } from 'express';
import { QueryTypes } from 'sequelize';
import db from '../config/db';
import FilterParams from '../helpers/FilterParams';

class Region {
	async get(req: Request): Promise<any> {
	
		let query =
			'select distinct reg.nama_pulau_alias as region_name, reg.pulau_id_alias as region_id FROM ms_pulau_alias as reg INNER JOIN mstr_outlet as o on reg.pulau_id_alias = o.region_id INNER JOIN ms_user_scope as us on o.outlet_id = us.scope INNER JOIN ms_dist_pic as dp on o.distributor_id = dp.distributor_id WHERE reg.pulau_id_alias IS NOT NULL';

		let {query: newQuery, params} = FilterParams.query(req, query)
	
		
	
		return await db.query(newQuery + ' order by reg.pulau_id_alias ASC', {
			raw: true,
			type: QueryTypes.SELECT,
			replacements: params,
		});
	  }
}

export default new Region();
