import {QueryTypes} from "sequelize";
import db from "../config/db";
import FilterParams from "../helpers/FilterParams";

class Provinsi {
  async getNameById(id: string): Promise<any> {
    const query = "SELECT name FROM provinces WHERE id = ?";

    // let { query: newQuery, params } = FilterParams.alamat(data, query);

    const find: any = await db.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: [id],
    });

    return find ? find[0]?.name : null;
  }
  async get(data: any): Promise<any> {
    const query =
      "SELECT DISTINCT p.* FROM provinces AS p INNER JOIN cities AS c ON p.`id` = c.`provinces_id` INNER JOIN districts AS d ON d.`cities_id` = c.`id` INNER JOIN subdistricts AS sd ON sd.`districts_id` = d.`id`";

    const { query: newQuery, params } = FilterParams.alamat(data, query);

    return await db.query(newQuery, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: params,
    });
  }
}

export default new Provinsi();
