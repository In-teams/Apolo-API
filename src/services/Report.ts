import { QueryTypes } from "sequelize";
import db from "../config/db";

class Area {
  async get(): Promise<any> {
    return await db.query("", {
      raw: true,
      type: QueryTypes.SELECT,
    });
  }
}

export default new Area();
