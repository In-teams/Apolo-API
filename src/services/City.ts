import { QueryTypes } from "sequelize";
import db from "../config/db";
import FilterParams from "../helpers/FilterParams";

class City {
  async get(data: any): Promise<any> {
    let query =
      "SELECT DISTINCT c.* FROM provinces AS p INNER JOIN cities AS c ON p.`id` = c.`provinces_id` INNER JOIN districts AS d ON d.`cities_id` = c.`id` INNER JOIN subdistricts AS sd ON sd.`districts_id` = d.`id`";

    let { query: newQuery, params } = FilterParams.alamat(data, query);

    return await db.query(newQuery, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: params,
    });
  }
}

export default new City();
