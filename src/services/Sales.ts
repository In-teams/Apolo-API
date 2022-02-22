import {Request} from 'express';
import {QueryTypes} from 'sequelize';
import db from '../config/db';
import ArrayOfObjToObj from '../helpers/ArrayOfObjToObj';
import filterParams from '../helpers/FilterParams';
import salesByHirarki from '../types/SalesInterface';

const queryTarget: string =
    'SELECT SUM(st.target_sales) AS target FROM ( SELECT * FROM mstr_sales_target UNION SELECT * FROM mstr_sales_target2 UNION SELECT * FROM mstr_sales_target3 UNION SELECT * FROM mstr_sales_target4 ) AS st INNER JOIN mstr_outlet AS ou ON ou.outlet_id = st.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_bulan AS b ON b.bulan = st.month_target WHERE st.outlet_id IS NOT NULL';
let queryTargetByOutlet: string =
    'SELECT SUM(st.target_sales) AS target, st.outlet_id, b.id AS bulan FROM ( SELECT * FROM mstr_sales_target UNION SELECT * FROM mstr_sales_target2 UNION SELECT * FROM mstr_sales_target3 UNION SELECT * FROM mstr_sales_target4 ) AS st INNER JOIN mstr_outlet AS ou ON ou.outlet_id = st.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_bulan AS b ON b.bulan = st.month_target WHERE st.outlet_id IS NOT NULL';

const queryAktual: string =
    'SELECT SUM(trb.sales) AS aktual FROM trx_transaksi tr INNER JOIN trx_transaksi_barang trb ON trb.kd_transaksi = tr.kd_transaksi INNER JOIN mstr_outlet AS ou ON ou.outlet_id = tr.no_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id WHERE ou.outlet_id IS NOT NULL';

let queryAktualAndPoint: string =
    'SELECT ou.outlet_id, MONTH(tr.tgl_transaksi) AS bulan, SUM(sales) AS aktual, SUM(point_satuan) AS poin, COUNT(DISTINCT no_id) AS outlets FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.kd_transaksi = trb.kd_transaksi INNER JOIN mstr_outlet AS ou ON tr.no_id = ou.outlet_id INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_head_region AS hr ON r.head_region_id = hr.head_region_id WHERE ou.outlet_id IS NOT NULL';

let queryOutletCount =
    'SELECT COUNT(DISTINCT ou.outlet_id) AS total FROM mstr_outlet AS ou INNER JOIN ms_pulau_alias AS r ON ou.`region_id` = r. `pulau_id_alias` INNER JOIN ms_dist_pic AS pic ON ou.`distributor_id` = pic.`distributor_id` WHERE ou.`outlet_id` IS NOT NULL';

const getTarget = (data: any, col: string) => {
    let query = `SELECT ${col} FROM ( SELECT * FROM mstr_sales_target UNION SELECT * FROM mstr_sales_target2 UNION SELECT * FROM mstr_sales_target3 UNION SELECT * FROM mstr_sales_target4 ) AS st INNER JOIN ms_bulan AS b ON b.bulan = month_target INNER JOIN mstr_outlet AS o ON o.outlet_id = st.outlet_id WHERE 1 = 1`;

    const {month_id, quarter_id} = data;
    if (month_id) {
        query += ' AND b.id = :month_id';
    }
    if (quarter_id) {
        query += ' AND b.id IN(:quarter_id)';
    }
    return query;
};
const getAktual = (data: any) => {
    let query = `SELECT SUM(trb.sales) AS aktual, SUM(trb.point_satuan) AS achieve, tr.no_id FROM trx_transaksi tr INNER JOIN trx_transaksi_barang trb ON trb.kd_transaksi = tr.kd_transaksi INNER JOIN mstr_outlet AS o ON o.outlet_id = tr.no_id INNER JOIN ms_bulan AS b ON b.id = MONTH(tr.tgl_transaksi) WHERE 1 = 1`;

    const {month_id, quarter_id} = data;
    if (month_id) {
        query += ' AND b.id = :month_id';
    }
    if (quarter_id) {
        query += ' AND b.id IN(:quarter_id)';
    }
    return query;
};
const getRedeem = (data: any) => {
    let query = `SELECT CAST( SUM(trrb.point_satuan * trrb.quantity) AS DECIMAL(20, 2) ) AS redeem, tr.no_id FROM trx_transaksi_redeem AS tr INNER JOIN trx_transaksi_redeem_barang AS trrb ON tr.kd_transaksi = trrb.kd_transaksi INNER JOIN ms_bulan AS b ON b.id = MONTH(tr.tgl_transaksi) INNER JOIN mstr_outlet AS o ON o.outlet_id = tr.no_id WHERE 1 = 1`;

    const {month_id, quarter_id} = data;
    if (month_id) {
        query += ' AND b.id = :month_id';
    }
    if (quarter_id) {
        query += ' AND b.id IN(:quarter_id)';
    }
    return query + ' GROUP BY tr.no_id';
};
const getRegist = (data: any) => {
    let query = `SELECT COUNT(DISTINCT fr.outlet_id) AS registrasi, fr.outlet_id FROM trx_file_registrasi AS fr INNER JOIN ms_bulan AS b ON b.id = MONTH(fr.tgl_upload) INNER JOIN mstr_outlet AS o ON o.outlet_id = fr.outlet_id WHERE 1 = 1`;

    const {month_id, quarter_id} = data;
    if (month_id) {
        query += ' AND b.id = :month_id';
    }
    if (quarter_id) {
        query += ' AND b.id IN(:quarter_id)';
    }
    return query + ' GROUP BY fr.outlet_id';
};
let getOutlet =
    'SELECT COUNT(outlet_id) FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = r.head_region_id INNER JOIN ms_dist_pic AS pic ON o.distributor_id = pic.distributor_id INNER JOIN ms_pic as mp ON mp.kode_pic = pic.asm_id INNER JOIN mstr_distributor as d ON d.distributor_id = o.distributor_id INNER JOIN ms_city_alias as c ON c.city_id_alias = o.city_id_alias WHERE 1 = 1';

const getSalesByHirarki = (
    hirarki: string,
    payload: any,
    isCount: boolean = false,
    isLimit: boolean = true
) => {
    const {sort = 'pencapaian,DESC', show = 10, page = 1, keyword} = payload;
    const sortBy = sort.split(",")[0];
    const sortDesc = sort.split(",")[1];

    const {
        wilayah_id,
        ass_id,
        asm_id,
    } = payload;

    const thisPage = show * page - show;
    let cols = '',
        groupBy = '';
    if (hirarki === 'wilayah') {
        cols =
            'mhr.head_region_id, mhr.head_region_name, mhr.head_region_name AS wilayah';
        if (isCount) {
            groupBy = 'SELECT COUNT(DISTINCT mhr.head_region_id) AS total FROM mstr_outlet AS o ' +
                'INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias ' +
                'INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = r.head_region_id ';

            if (ass_id || asm_id) {
                groupBy += ` INNER JOIN ms_dist_pic AS pic ON o.distributor_id = pic.distributor_id `
            }

            if (ass_id) {
                groupBy += ` INNER JOIN ms_pic as mp ON mp.kode_pic = pic.ass_id `
            }

            if (asm_id) {
                groupBy += ` INNER JOIN ms_pic as mp ON mp.kode_pic = pic.asm_id `
            }

            groupBy += ' WHERE 1=1 '

            if (keyword) {
                groupBy += ` AND mhr.head_region_name like "%${keyword}%"`
            }

            groupBy = filterParams.sales(groupBy, payload);

            groupBy += ` GROUP BY mhr.head_region_id `
        } else {
            groupBy = 'mhr.head_region_id, mhr.head_region_name, mhr.head_region_name';
        }
    } else if (hirarki === 'region') {
        cols =
            'r.pulau_id_alias AS region_id, r.nama_pulau_alias AS region_name, r.nama_pulau_alias AS region';
        if (isCount) {
            groupBy = `SELECT COUNT(DISTINCT o.region_id) AS total FROM mstr_outlet AS o 
            INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias `

            if (ass_id || asm_id) {
                groupBy += ` INNER JOIN ms_dist_pic AS pic ON o.distributor_id = pic.distributor_id `
            }

            if (ass_id) {
                groupBy += ` INNER JOIN ms_pic as mp ON mp.kode_pic = pic.ass_id `
            }

            if (asm_id) {
                groupBy += ` INNER JOIN ms_pic as mp ON mp.kode_pic = pic.asm_id `
            }

            if (wilayah_id) {
                groupBy += ` INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = r.head_region_id `
            }

            groupBy += ' WHERE 1=1 '

            if (keyword) {
                groupBy += ` AND r.nama_pulau_alias like "%${keyword}%"`
            }

            groupBy = filterParams.sales(groupBy, payload);

            groupBy += ` GROUP BY o.region_id `
        } else {
            groupBy = 'r.pulau_id_alias, r.nama_pulau_alias';
        }
    } else if (hirarki === 'distributor') {
        cols =
            'd.distributor_name as distributor, d.distributor_id, d.distributor_name';
        if (isCount) {
            groupBy = 'SELECT COUNT(DISTINCT o.distributor_id) AS total FROM mstr_outlet AS o ' +
                'INNER JOIN mstr_distributor as d ON d.distributor_id = o.distributor_id ';

            if (ass_id || asm_id) {
                groupBy += ` INNER JOIN ms_dist_pic AS pic ON o.distributor_id = pic.distributor_id `
            }

            if (ass_id) {
                groupBy += ` INNER JOIN ms_pic as mp ON mp.kode_pic = pic.ass_id `
            }

            if (asm_id) {
                groupBy += ` INNER JOIN ms_pic as mp ON mp.kode_pic = pic.asm_id `
            }

            if (wilayah_id) {
                groupBy += ` INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias 
                INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = r.head_region_id `
            }

            groupBy += ' WHERE 1=1 '

            if (keyword) {
                groupBy += ` AND d.distributor_name like "%${keyword}%"`
            }

            groupBy = filterParams.sales(groupBy, payload);

            groupBy += ` GROUP BY o.distributor_id `
        } else {
            groupBy = 'd.distributor_name, d.distributor_id';
        }
    } else if (hirarki === 'area') {
        cols = 'c.city_name_alias as area_name, c.city_id_alias as area_id';
        if (isCount) {
            groupBy = `SELECT COUNT(DISTINCT o.city_id_alias) AS total FROM mstr_outlet AS o  
            INNER JOIN ms_city_alias as c ON c.city_id_alias = o.city_id_alias `

            if (ass_id || asm_id) {
                groupBy += ` INNER JOIN ms_dist_pic AS pic ON o.distributor_id = pic.distributor_id `
            }

            if (ass_id) {
                groupBy += ` INNER JOIN ms_pic as mp ON mp.kode_pic = pic.ass_id `
            }

            if (asm_id) {
                groupBy += ` INNER JOIN ms_pic as mp ON mp.kode_pic = pic.asm_id `
            }

            if (wilayah_id) {
                groupBy += ` INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias 
                INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = r.head_region_id `
            }

            groupBy += ' WHERE 1=1 '

            if (keyword) {
                groupBy += ` AND c.city_name_alias like "%${keyword}%"`
            }

            groupBy = filterParams.sales(groupBy, payload);

            groupBy += ` GROUP BY o.city_id_alias `
        } else {
            groupBy = 'c.city_name_alias, c.city_id_alias';
        }
    } else if (hirarki === 'outlet') {
        cols = 'o.outlet_name as outlet_name, o.outlet_id';
        if (isCount) {
            groupBy = `SELECT COUNT(DISTINCT o.outlet_id) AS total FROM mstr_outlet AS o `

            if (ass_id || asm_id) {
                groupBy += ` INNER JOIN ms_dist_pic AS pic ON o.distributor_id = pic.distributor_id `
            }

            if (ass_id) {
                groupBy += ` INNER JOIN ms_pic as mp ON mp.kode_pic = pic.ass_id `
            }

            if (asm_id) {
                groupBy += ` INNER JOIN ms_pic as mp ON mp.kode_pic = pic.asm_id `
            }

            if (wilayah_id) {
                groupBy += ` INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias 
                INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = r.head_region_id `
            }

            groupBy += ' WHERE 1=1 '

            if (keyword) {
                groupBy += ` AND o.outlet_name like "%${keyword}%"`
            }

            groupBy = filterParams.sales(groupBy, payload);
        } else {
            groupBy = 'o.outlet_name, o.outlet_id';
        }
    } else if (hirarki === 'asm') {
        cols = 'mp.nama_pic as nama_pic, pic.asm_id';
        if (isCount) {
            groupBy = `SELECT COUNT(DISTINCT pic.asm_id) AS total FROM mstr_outlet AS o 
            INNER JOIN ms_dist_pic AS pic ON o.distributor_id = pic.distributor_id 
            INNER JOIN ms_pic as mp ON mp.kode_pic = pic.asm_id `

            if (ass_id || asm_id) {
                groupBy += ` INNER JOIN ms_dist_pic AS pic ON o.distributor_id = pic.distributor_id `
            }

            if (ass_id) {
                groupBy += ` INNER JOIN ms_pic as mp ON mp.kode_pic = pic.ass_id `
            }

            if (wilayah_id) {
                groupBy += ` INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias 
                INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = r.head_region_id `
            }

            groupBy += ' WHERE 1=1 '

            if (keyword) {
                groupBy += ` AND mp.nama_pic like "%${keyword}%"`
            }

            groupBy = filterParams.sales(groupBy, payload);

            groupBy += ` GROUP BY pic.asm_id`
        } else {
            groupBy = 'mp.nama_pic, pic.asm_id';
        }
    } else if (hirarki === 'ass') {
        cols = 'mp.nama_pic as nama_pic, pic.ass_id';
        if (isCount) {
            groupBy = `SELECT COUNT(DISTINCT pic.ass_id) AS total FROM mstr_outlet AS o
            INNER JOIN ms_dist_pic AS pic ON o.distributor_id = pic.distributor_id 
            INNER JOIN ms_pic as mp ON mp.kode_pic = pic.ass_id  `

            if (ass_id || asm_id) {
                groupBy += ` INNER JOIN ms_dist_pic AS pic ON o.distributor_id = pic.distributor_id `
            }

            if (asm_id) {
                groupBy += ` INNER JOIN ms_pic as mp ON mp.kode_pic = pic.asm_id `
            }

            if (wilayah_id) {
                groupBy += ` INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias 
                INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = r.head_region_id `
            }

            groupBy += ' WHERE 1=1 '

            if (keyword) {
                groupBy += ` AND mp.nama_pic like "%${keyword}%"`
            }

            groupBy = filterParams.sales(groupBy, payload);

            groupBy += ` GROUP BY pic.ass_id `
        } else {
            groupBy = 'mp.nama_pic, pic.ass_id';
        }
    }

    let target = getTarget(
        payload,
        'SUM(st.target_sales) AS target, o.outlet_id'
    );
    let aktual = getAktual(payload);
    let redeem = getRedeem(payload);
    let regist = getRegist(payload);
    let totalTarget = getTarget(payload, 'SUM(st.target_sales) AS target');
    let outlets = filterParams.sales(getOutlet, payload);
    let query = '';
    if (!isCount) {
        query = `SELECT ${cols}, CONCAT(TRUNCATE((CAST(IFNULL(SUM(aktual), 0) AS UNSIGNED)/(${totalTarget})) * 100, 2), '%') AS kontribusi, IFNULL(SUM(target), 0) AS target, CAST(IFNULL(SUM(aktual), 0) AS UNSIGNED) AS aktual, IFNULL(TRUNCATE(CAST(IFNULL(SUM(aktual), 0) AS UNSIGNED) / IFNULL(SUM(target), 0) * 100, 2), 0) AS pencapaian, CONCAT( IFNULL(TRUNCATE(CAST(IFNULL(SUM(aktual), 0) AS UNSIGNED) / IFNULL(SUM(target), 0) * 100, 2), 0), '%' ) AS percentage, IFNULL(SUM(redeem), 0) AS redeem, IFNULL(SUM(achieve), 0) AS achieve, COUNT(o.outlet_id) AS outlet, IFNULL(SUM(registrasi), 0) AS regist, ( COUNT(o.outlet_id) - IFNULL(SUM(registrasi), 0) ) AS notregist, CONCAT( TRUNCATE( (IFNULL(SUM(registrasi), 0)) / COUNT(o.outlet_id) * 100, 2 ), '%' ) AS regist_progress, COUNT(a.no_id) AS ao, CONCAT( TRUNCATE(COUNT(a.no_id) / COUNT(o.outlet_id) * 100, 2), '%' ) AS aoro, IFNULL(SUM(achieve), 0) - IFNULL(SUM(redeem), 0) AS diff_point, CAST(IFNULL(SUM(aktual), 0) AS UNSIGNED) - IFNULL(SUM(target), 0) AS diff, (${totalTarget}) AS total_target, CONCAT( TRUNCATE( IFNULL(SUM(target), 0) /(${totalTarget}) * 100, 2 ), '%' ) AS bobot_target, (${outlets}) AS total_outlet, CONCAT( TRUNCATE( ( COUNT(o.outlet_id) /(${outlets}) * 100 ), 2 ), '%' ) AS bobot_outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = r.head_region_id INNER JOIN ms_dist_pic AS pic ON o.distributor_id = pic.distributor_id INNER JOIN ms_pic as mp ON mp.kode_pic = pic.asm_id INNER JOIN mstr_distributor as d ON d.distributor_id = o.distributor_id INNER JOIN ms_city_alias as c ON c.city_id_alias = o.city_id_alias LEFT JOIN ( ${target} GROUP BY outlet_id ) AS t ON t.outlet_id = o.outlet_id LEFT JOIN (${aktual} GROUP BY tr.no_id) AS a ON a.no_id = o.outlet_id LEFT JOIN (${redeem}) AS b ON b.no_id = o.outlet_id LEFT JOIN (${regist}) AS d ON d.outlet_id = o.outlet_id WHERE 1 = 1`;
        if (keyword) {
            switch (hirarki) {
                case "wilayah":
                    query += ` AND mhr.head_region_name LIKE '%${keyword}%'`
                    break;
                case "region":
                    query += ` AND r.nama_pulau_alias LIKE '%${keyword}%'`
                    break;
                case "distributor":
                    query += ` AND d.distributor_name LIKE '%${keyword}%'`
                    break;
                case "area":
                    query += ` AND c.city_name_alias LIKE '%${keyword}%'`
                    break;
                case "outlet":
                    query += ` AND o.outlet_name LIKE '%${keyword}%'`
                    break;
                case "asm":
                    query += ` AND mp.nama_pic LIKE '%${keyword}%'`
                    break;
                case "ass":
                    query += ` AND mp.nama_pic LIKE '%${keyword}%'`
                    break;
            }
        }
        query = filterParams.sales(query, payload);
        query += ` GROUP BY ${groupBy} ORDER BY ${sortBy} ${sortDesc}`;
        if (isLimit) {
            query += ` LIMIT ${show} OFFSET ${thisPage}`;
        }
        return query;
    } else {
        // query = `SELECT COUNT(DISTINCT ${groupBy}) AS total FROM mstr_outlet AS o
        // INNER JOIN ms_pulau_alias AS r ON o.region_id = r.pulau_id_alias
        // INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = r.head_region_id
        // INNER JOIN ms_dist_pic AS pic ON o.distributor_id = pic.distributor_id
        // INNER JOIN ms_pic as mp ON mp.kode_pic = pic.asm_id
        // INNER JOIN mstr_distributor as d ON d.distributor_id = o.distributor_id
        // INNER JOIN ms_city_alias as c ON c.city_id_alias = o.city_id_alias
        // LEFT JOIN ( ${target} GROUP BY outlet_id ) AS t ON t.outlet_id = o.outlet_id
        // LEFT JOIN (${aktual} GROUP BY tr.no_id) AS a ON a.no_id = o.outlet_id
        // LEFT JOIN (${redeem}) AS b ON b.no_id = o.outlet_id
        // LEFT JOIN (${regist}) AS d ON d.outlet_id = o.outlet_id
        // WHERE 1 = 1`;
        query = groupBy
        // if (keyword) {
        //     query += ` AND ${groupBy} LIKE '%${keyword}%'`
        // }
        // query += ` GROUP BY ${groupBy}`;
        return query;
    }
};

class Sales {
    async getOutletCount(req: Request): Promise<{ target: number }[]> {
        let {query: newQuery, params} = filterParams.count(req, queryOutletCount);

        return await db.query(newQuery, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: params,
        });
    }

    async getTarget(req: Request): Promise<{ target: number }[]> {
        let query =
            'SELECT SUM(st.target_sales) AS target FROM ( SELECT * FROM mstr_sales_target UNION SELECT * FROM mstr_sales_target2 UNION SELECT * FROM mstr_sales_target3 UNION SELECT * FROM mstr_sales_target4 ) AS st INNER JOIN mstr_outlet AS ou ON ou.outlet_id = st.outlet_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_bulan AS b ON b.bulan = st.month_target WHERE st.outlet_id IS NOT NULL';
        let {query: q, params: p} = filterParams.target(req, query);

        const data: any = await db.query(q, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: [...p],
        });

        return data;
        return data[0].target;
    }

    async getSalesByDistributor(req: Request): Promise<salesByHirarki[]> {
        const {sort} = req.validated;
        let qTarget = queryTarget + ' AND ou.`distributor_id` = d.`distributor_id`';
        let qAktual = queryAktual + ' AND ou.`distributor_id` = d.`distributor_id`';

        let {query: qt, params: pt} = filterParams.target(req, qTarget);
        let {query: qa, params: pa} = filterParams.aktual(req, qAktual);

        let query = `SELECT d.distributor_name as distributor, d.distributor_id, (${qt}) AS target, (${qa}) AS aktual, (TRUNCATE(((${qa})/(${qt})* 100), 2 )) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN mstr_distributor as d ON d.distributor_id = o.distributor_id INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE d.distributor_id IS NOT NULL`;

        let {query: newQuery, params}: { query: string; params: string[] } =
            filterParams.query(req, query);

        newQuery += ` GROUP BY d.distributor_id ORDER BY pencapaian ${sort} LIMIT 5`;

        return await db.query(newQuery, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: [...pt, ...pa, ...pt, ...pa, ...params],
        });
    }

    async getSalesByArea(req: Request): Promise<salesByHirarki[]> {
        const {sort} = req.validated;
        let qTarget = queryTarget + ' AND ou.city_id_alias = ci.city_id_alias';
        let qAktual = queryAktual + ' AND ou.city_id_alias = ci.city_id_alias';

        let {query: qt, params: pt} = filterParams.target(req, qTarget);
        let {query: qa, params: pa} = filterParams.aktual(req, qAktual);

        let query = `SELECT ci.city_name_alias as city, (${qt}) AS target, (${qa}) AS aktual, (TRUNCATE(((${qAktual})/(${qt})* 100), 2 )) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN ms_city_alias as ci ON ci.city_id_alias = o.city_id_alias INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE ci.city_id_alias IS NOT NULL`;

        let {query: newQuery, params}: { query: string; params: string[] } =
            filterParams.query(req, query);

        newQuery += ` GROUP BY ci.city_id_alias ORDER BY pencapaian ${sort} LIMIT 5`;

        return await db.query(newQuery, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: [...pt, ...pa, ...pt, ...pa, ...params],
        });
    }

    async getSalesByOutlet(req: Request): Promise<salesByHirarki[]> {
        const {sort = "pencapaian,DESC"} = req.validated;
        const sortBy = sort.split(",")[0]
        const sortDesc = sort.split(",")[1]
        let qTarget = queryTarget + ' AND ou.outlet_id = o.outlet_id';
        let qAktual = queryAktual + ' AND ou.outlet_id = o.outlet_id';

        let {query: qt, params: pt} = filterParams.target(req, qTarget);
        let {query: qa, params: pa} = filterParams.aktual(req, qAktual);

        // console.log(qt)

        let query = `SELECT o.outlet_name as outlet_name, (${qt}) AS target, (${qa}) AS aktual, (TRUNCATE(((${qa})/(${qt})* 100), 2 )) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`;

        let {query: newQuery, params}: { query: string; params: string[] } =
            filterParams.query(req, query);

        newQuery += ` GROUP BY o.outlet_id ORDER BY ${sortBy} ${sortDesc} LIMIT 5`;

        return await db.query(newQuery, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: [...pt, ...pa, ...pt, ...pa, ...params],
        });
    }

    async getSalesByRegion(req: Request): Promise<salesByHirarki[]> {
        const {sort} = req.validated;
        let qTarget = queryTarget + ' AND ou.region_id = reg.pulau_id_alias';
        let qAktual = queryAktual + ' AND ou.region_id = reg.pulau_id_alias';

        let {query: qt, params: pt} = filterParams.target(req, qTarget);
        let {query: qa, params: pa} = filterParams.aktual(req, qAktual);

        let query = `SELECT reg.nama_pulau_alias AS region, (${qt}) AS target, (${qa}) AS aktual, (TRUNCATE(((${qa})/(${qt})* 100), 2 )) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE reg.pulau_id_alias IS NOT NULL`;

        let {query: newQuery, params}: { query: string; params: string[] } =
            filterParams.query(req, query);

        newQuery += ` GROUP BY reg.pulau_id_alias ORDER BY pencapaian ${sort} LIMIT 5`;

        return await db.query(newQuery, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: [...pt, ...pa, ...pt, ...pa, ...params],
        });
    }

    async getSalesByHR(req: Request): Promise<salesByHirarki[]> {
        const {sort} = req.validated;
        let qTarget = queryTarget + ' AND r.head_region_id = mhr.head_region_id';
        let qAktual = queryAktual + ' AND r.head_region_id = mhr.head_region_id';

        let {query: qt, params: pt} = filterParams.target(req, qTarget);
        let {query: qa, params: pa} = filterParams.aktual(req, qAktual);

        let query = `SELECT mhr.head_region_name AS wilayah, mhr.head_region_id AS wilayah_id, (${qt}) AS target, (${qa}) AS aktual, (TRUNCATE(((${qa})/(${qt})* 100), 2 )) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_head_region AS mhr ON mhr.head_region_id = reg.head_region_id INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE mhr.head_region_id IS NOT NULL`;

        let {query: newQuery, params}: { query: string; params: string[] } =
            filterParams.query(req, query);

        newQuery += ` GROUP BY mhr.head_region_id ORDER BY pencapaian ${sort} LIMIT 5`;

        return await db.query(newQuery, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: [...pt, ...pa, ...pt, ...pa, ...params],
        });
    }

    async getSalesByASM(req: Request): Promise<salesByHirarki[]> {
        const {sort} = req.validated;
        let qTarget = queryTarget + ' AND pic.asm_id = mp.kode_pic';
        let qAktual = queryAktual + ' AND pic.asm_id = mp.kode_pic';

        let {query: qt, params: pt} = filterParams.target(req, qTarget);
        let {query: qa, params: pa} = filterParams.aktual(req, qAktual);

        let query = `SELECT mp.nama_pic as nama_pic, (${qt}) AS target, (${qa}) AS aktual, (TRUNCATE(((${qa})/(${qt})* 100), 2 )) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_pic as mp ON mp.kode_pic = dp.asm_id WHERE mp.kode_pic IS NOT NULL`;

        let {query: newQuery, params}: { query: string; params: string[] } =
            filterParams.query(req, query);

        newQuery += ` GROUP BY mp.kode_pic ORDER BY pencapaian ${sort} LIMIT 5`;

        return await db.query(newQuery, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: [...pt, ...pa, ...pt, ...pa, ...params],
        });
    }

    async getSalesByASS(req: Request): Promise<salesByHirarki[]> {
        const {sort} = req.validated;
        let qTarget = queryTarget + ' AND pic.ass_id = mp.kode_pic';
        let qAktual = queryAktual + ' AND pic.ass_id = mp.kode_pic';

        let {query: qt, params: pt} = filterParams.target(req, qTarget);
        let {query: qa, params: pa} = filterParams.aktual(req, qAktual);

        let query = `SELECT mp.nama_pic as nama_pic, (${qt}) AS target, (${qa}) AS aktual, (TRUNCATE(((${qa})/(${qt})* 100), 2 )) AS pencapaian, COUNT(o.outlet_id) AS outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_pic as mp ON mp.kode_pic = dp.ass_id WHERE mp.kode_pic IS NOT NULL`;

        let {query: newQuery, params}: { query: string; params: string[] } =
            filterParams.query(req, query);

        newQuery += ` GROUP BY mp.kode_pic ORDER BY pencapaian ${sort} LIMIT 5`;

        return await db.query(newQuery, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: [...pt, ...pa, ...pt, ...pa, ...params],
        });
    }

    async getSalesByAchiev(data: any) {
        let sub = getSalesByHirarki('outlet', data, false, false);
        let totalTarget = getTarget(data, 'SUM(st.target_sales) AS target');
        const query = `SELECT CONCAT(TRUNCATE((SUM(aktual)/(${totalTarget})) * 100, 2), '%') AS kontribusi, 
        CONCAT( TRUNCATE( SUM(target) /(${totalTarget}) * 100, 2 ), '%' ) AS bobot_target, 
        SUM(aktual) AS aktual, TRUNCATE(SUM(aktual) / SUM(target) * 100, 2) AS pencapaian, 
        CONCAT( TRUNCATE(SUM(aktual) / SUM(target) * 100, 2), '%' ) AS percentage, 
        CASE WHEN ((aktual / target) * 100) <= 0 OR ((aktual / target) * 100) IS NULL THEN 'ZERO ACHIEVER <= 0%' 
        WHEN ((aktual / target) * 100) > 0 AND ((aktual / target) * 100) < 70 THEN 'LOW ACHIEVER > 0%' 
        WHEN ((aktual / target) * 100) >= 70 AND ((aktual / target) * 100) < 90 THEN 'NEAR ACHIEVER >= 70%' 
        WHEN ((aktual / target) * 100) >= 90 AND ((aktual / target) * 100) < 100 THEN 'HIGH ACHIEVER >= 90%' 
        WHEN ((aktual / target) * 100) >= 100 THEN 'TOP ACHIEVER >= 100%' END AS cluster, 
        CASE WHEN ((aktual / target) * 100) <= 0 OR ((aktual / target) * 100) IS NULL THEN '1' 
        WHEN ((aktual / target) * 100) > 0 AND ((aktual / target) * 100) < 70 THEN '2' 
        WHEN ((aktual / target) * 100) >= 70 AND ((aktual / target) * 100) < 90 THEN '3' 
        WHEN ((aktual / target) * 100) >= 90 AND ((aktual / target) * 100) < 100 THEN '4' 
        WHEN ((aktual / target) * 100) >= 100 THEN '5' END AS id, 
        SUM(target) AS target, 
        SUM(aktual) AS aktual, 
        SUM(aktual) - SUM(target) AS diff, 
        SUM(ao) AS ao, 
        SUM(outlet) AS outlet, 
        CONCAT(TRUNCATE(SUM(ao) / SUM(outlet) * 100, 2), '%') AS aoro, 
        total_target, 
        total_outlet, 
        CONCAT( TRUNCATE(SUM(outlet) / total_outlet * 100, 2), '%' ) AS bobot_outlet, 
        CONCAT( TRUNCATE(SUM(outlet) / total_outlet * 100, 2), '%' ) AS bobot_outlet 
        FROM (${sub}) AS sub 
        GROUP BY cluster, id, bobot_outlet, bobot_outlet, total_target, total_outlet
        ORDER BY id DESC`;

        return await db.query(query, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: data,
        });
    }

    async getSummaryPerQuarter(req: Request) {
        let {query: qt, params: pt} = filterParams.target(
            req,
            queryTargetByOutlet
        );
        let {query: qap, params: pap} = filterParams.aktual(
            req,
            queryAktualAndPoint
        );

        qap += ' GROUP BY bulan';
        qt += ' GROUP BY b.id';

        let query = `SELECT b.bulan, aktual, poin, SUM(target) AS target, IFNULL(outlets, 0) AS outlets FROM mstr_outlet AS o LEFT JOIN(${qt}) AS mst ON mst.outlet_id = o.outlet_id LEFT JOIN(${qap}) AS trb ON trb.bulan = mst.bulan INNER JOIN ms_bulan AS b ON b.id = mst.bulan INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`;

        let {query: newQuery, params} = filterParams.query(req, query);
        newQuery += ' GROUP BY b.id ORDER BY b.id ASC';

        return await db.query(newQuery, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: [...pt, ...pap, ...params],
        });
    }

    async getSummaryPerSemester(req: Request) {
        const {semester_id} = req.validated;
        let {query: qt, params: pt} = filterParams.target(
            req,
            queryTargetByOutlet
        );
        let {query: qap, params: pap} = filterParams.aktual(
            req,
            queryAktualAndPoint
        );

        qap += ' GROUP BY bulan';
        qt += ' GROUP BY b.id';

        let query = `SELECT CASE WHEN b.id = 1 OR b.id = 2 OR b.id = 3 THEN '1' WHEN b.id = 4 OR b.id = 5 OR b.id = 6 THEN '2' WHEN b.id = 7 OR b.id = 8 OR b.id = 9 THEN '3' WHEN b.id = 10 OR b.id = 11 OR b.id = 12 THEN '4' END AS kuartal, SUM(aktual) AS aktual, SUM(poin) AS poin, SUM(target) AS target, IFNULL(outlets, 0) AS outlets FROM mstr_outlet AS o LEFT JOIN(${qt}) AS mst ON mst.outlet_id = o.outlet_id LEFT JOIN(${qap}) AS trb ON trb.bulan = mst.bulan INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_bulan AS b ON b.id = mst.bulan WHERE o.outlet_id IS NOT NULL`;

        if (semester_id) {
            query += ` AND b.id IN (${semester_id})`;
        }

        let {query: newQuery, params} = filterParams.query(req, query);
        newQuery += ' GROUP BY kuartal';

        return await db.query(newQuery, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: [...pt, ...pap, ...params],
        });
    }

    async getSummaryPerYear(req: Request) {
        let {query: qt, params: pt} = filterParams.target(
            req,
            queryTargetByOutlet
        );
        let {query: qap, params: pap} = filterParams.aktual(
            req,
            queryAktualAndPoint
        );

        qap += ' GROUP BY bulan';
        qt += ' GROUP BY b.id';

        let query = `SELECT CASE WHEN b.id = 1 OR b.id = 2 OR b.id = 3 OR b.id = 4 OR b.id = 5 OR b.id = 6 THEN '1' WHEN b.id = 4 OR b.id = 5 OR b.id = 6 OR b.id = 7 OR b.id = 8 OR b.id = 9 or b.id = 10 OR b.id = 11 OR b.id = 12 THEN '2' END AS kuartal, SUM(aktual) AS aktual, SUM(poin) AS poin, SUM(target) AS target FROM mstr_outlet AS o LEFT JOIN(${qt}) AS mst ON mst.outlet_id = o.outlet_id LEFT JOIN(${qap}) AS trb ON trb.bulan = mst.bulan INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_bulan AS b ON b.id = mst.bulan INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias WHERE o.outlet_id IS NOT NULL`;

        let {query: newQuery, params} = filterParams.query(req, query);
        newQuery += ' GROUP BY kuartal';

        return await db.query(newQuery, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: [...pt, ...pap, ...params],
        });
    }

    async getSummaryPerYears(req: Request) {
        let {query: qt, params: pt} = filterParams.target(
            req,
            queryTargetByOutlet
        );
        let {query: qap, params: pap} = filterParams.aktual(
            req,
            queryAktualAndPoint
        );

        qap += ' GROUP BY bulan';
        qt += ' GROUP BY b.id';

        let query = `SELECT SUM(aktual) AS aktual, SUM(poin) AS poin, SUM(target) AS target FROM mstr_outlet AS o LEFT JOIN(${qt}) AS mst ON mst.outlet_id = o.outlet_id LEFT JOIN(${qap}) AS trb ON trb.bulan = mst.bulan INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_bulan AS b ON b.id = mst.bulan WHERE o.outlet_id IS NOT NULL`;

        let {query: newQuery, params} = filterParams.query(req, query);

        return await db.query(newQuery, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: [...pt, ...pap, ...params],
        });
    }

    async getSummary(req: Request) {
        let {query: qt, params: pt} = filterParams.target(req, queryTarget);
        let {query: qa, params: pa} = filterParams.aktual(req, queryAktual);
        let {query: qo, params: po} = filterParams.count(req, queryOutletCount);

        let query = `SELECT DISTINCT (${qa}) AS aktual, (${qt}) AS target, (${qo}) AS total_outlet FROM mstr_outlet AS o INNER JOIN ms_pulau_alias AS reg ON o.region_id = reg.pulau_id_alias INNER JOIN ms_dist_pic AS dp ON o.distributor_id = dp.distributor_id WHERE o.outlet_id IS NOT NULL`;

        let {query: newQuery, params} = filterParams.query(req, query);

        return await db.query(newQuery, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: [...pt, ...pa, ...po, ...params],
        });
    }

    async getTargetByHirarki(req: Request, type?: string) {
        let select = '';
        let groupBy = '';
        if (type === 'outlet') {
            select = 'ou.outlet_id, ou.outlet_name';
            groupBy = 'ou.outlet_id';
        } else if (type === 'hr') {
            select = 'hr.head_region_id, hr.head_region_name';
            groupBy = 'hr.head_region_id';
        } else if (type === 'region') {
            select = 'r.pulau_id_alias AS region_id, r.nama_pulau_alias AS region';
            groupBy = 'r.pulau_id_alias';
        } else if (type === 'distributor') {
            select = 'd.distributor_id, d.distributor_name AS distributor';
            groupBy = 'd.distributor_id';
        } else if (type === 'area') {
            select = 'c.city_id_alias AS area_id, c.city_name_alias AS city';
            groupBy = 'c.city_id_alias';
        } else if (type === 'asm') {
            select = 'p.kode_pic AS asm_id, p.nama_pic';
            groupBy = 'asm_id';
        } else if (type === 'ass') {
            select = 'ass.kode_pic AS ass_id, ass.nama_pic';
            groupBy = 'ass_id';
        }
        let q = `SELECT SUM(mst.target_sales) AS target, ${select}, COUNT(DISTINCT mst.outlet_id) AS outlet FROM ( SELECT * FROM mstr_sales_target UNION SELECT * FROM mstr_sales_target2 UNION SELECT * FROM mstr_sales_target3 UNION SELECT * FROM mstr_sales_target4 ) AS mst INNER JOIN ms_bulan AS b ON b.bulan = mst.month_target INNER JOIN mstr_outlet as ou ON ou.outlet_id = mst.outlet_id INNER JOIN mstr_distributor AS d ON d.distributor_id = ou.distributor_id INNER JOIN ms_city_alias AS c ON c.city_id_alias = ou.city_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_pic AS p ON p.kode_pic = pic.asm_id INNER JOIN ms_pic AS ass ON ass.kode_pic = pic.ass_id INNER JOIN ms_pulau_alias AS r ON ou. region_id = r.pulau_id_alias INNER JOIN ms_head_region AS hr ON hr.head_region_id = r.head_region_id WHERE mst.outlet_id IS NOT NULL`;

        let {query, params} = filterParams.target(req, q);

        return await db.query(query + ` GROUP BY ${groupBy}`, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: [...params],
        });
    }

    async getAktualByHirarki(
        req: Request,
        type?: string
    ): Promise<{ aktual: string; no_id: string }[]> {
        let select = '';
        let groupBy = '';
        if (type === 'outlet') {
            select = 'ou.outlet_id, ou.outlet_name';
            groupBy = 'ou.outlet_id';
        } else if (type === 'hr') {
            select = 'hr.head_region_id, hr.head_region_name';
            groupBy = 'hr.head_region_id';
        } else if (type === 'region') {
            select = 'r.pulau_id_alias AS region_id, r.nama_pulau_alias AS region';
            groupBy = 'r.pulau_id_alias';
        } else if (type === 'distributor') {
            select = 'd.distributor_id, d.distributor_name AS distributor';
            groupBy = 'd.distributor_id';
        } else if (type === 'area') {
            select = 'c.city_id_alias AS area_id, c.city_name_alias AS city';
            groupBy = 'c.city_id_alias';
        } else if (type === 'asm') {
            select = 'p.kode_pic AS asm_id, p.nama_pic';
            groupBy = 'asm_id';
        } else if (type === 'ass') {
            select = 'ass.kode_pic AS ass_id, ass.nama_pic';
            groupBy = 'ass_id';
        }
        let q = `SELECT SUM(trb.sales) AS aktual, ${select}, COUNT(DISTINCT tr.no_id) AS outlet FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.kd_transaksi = trb.kd_transaksi INNER JOIN mstr_outlet AS ou ON ou.outlet_id = tr.no_id INNER JOIN mstr_distributor AS d ON d.distributor_id = ou.distributor_id INNER JOIN ms_city_alias AS c ON c.city_id_alias = ou.city_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_pic AS p ON p.kode_pic = pic.asm_id INNER JOIN ms_pic AS ass ON ass.kode_pic = pic.ass_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_head_region AS hr ON hr.head_region_id = r.head_region_id WHERE tr.no_id IS NOT NULL`;

        let {query, params} = filterParams.aktual(req, q);

        return await db.query(query + ` GROUP BY ${groupBy}`, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: [...params],
        });
    }

    async getAktualByMonth(req: Request): Promise<any> {
        let q = `SELECT SUM(trb.sales) AS aktual, COUNT(DISTINCT tr.no_id) AS outlet, MONTH(tr.tgl_transaksi) AS bulan FROM trx_transaksi AS tr INNER JOIN trx_transaksi_barang AS trb ON tr.kd_transaksi = trb.kd_transaksi INNER JOIN mstr_outlet AS ou ON ou.outlet_id = tr.no_id INNER JOIN mstr_distributor AS d ON d.distributor_id = ou.distributor_id INNER JOIN ms_city_alias AS c ON c.city_id_alias = ou.city_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_pulau_alias AS r ON ou.region_id = r.pulau_id_alias INNER JOIN ms_head_region AS hr ON hr.head_region_id = r.head_region_id WHERE tr.no_id IS NOT NULL`;

        let {query, params} = filterParams.aktual(req, q);

        const data = await db.query(query + ` GROUP BY bulan`, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: [...params],
        });

        return ArrayOfObjToObj(data, 'bulan', 'aktual', 'outlet');
    }

    async getTargetByMonth(req: Request) {
        let q = `SELECT SUM(mst.target_sales) AS target, COUNT(DISTINCT mst.outlet_id) AS outlet, mst.month_target AS bulan FROM ( SELECT * FROM mstr_sales_target UNION SELECT * FROM mstr_sales_target2 UNION SELECT * FROM mstr_sales_target3 UNION SELECT * FROM mstr_sales_target4 ) AS mst INNER JOIN ms_bulan AS b ON b.bulan = mst.month_target INNER JOIN mstr_outlet as ou ON ou.outlet_id = mst.outlet_id INNER JOIN mstr_distributor AS d ON d.distributor_id = ou.distributor_id INNER JOIN ms_city_alias AS c ON c.city_id_alias = ou.city_id_alias INNER JOIN ms_dist_pic AS pic ON ou.distributor_id = pic.distributor_id INNER JOIN ms_pulau_alias AS r ON ou. region_id = r.pulau_id_alias INNER JOIN ms_head_region AS hr ON hr.head_region_id = r.head_region_id WHERE mst.outlet_id IS NOT NULL`;

        let {query, params} = filterParams.target(req, q);

        const data = await db.query(query + ` GROUP BY bulan`, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: [...params],
        });

        return ArrayOfObjToObj(data, 'bulan', 'target', 'outlet');
    }

    async getSalesByHirarki(hirarki: string, data: any) {
        const query = getSalesByHirarki(hirarki, data);
        return await db.query(query, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: data,
        });
    }

    async countSalesByHirarki(hirarki: string, data: any) {
        const query = getSalesByHirarki(hirarki, data, true);
        return await db.query(query, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: data,
        });
    }
}

export default new Sales();
