import { QueryTypes } from "sequelize";
import db from "../config/db";

class Access {
  async get(level_id: string, access_id: number): Promise<any[]> {
    return await db.query(
      "SELECT * FROM ms_user_access WHERE level_id = ? AND access_id = ? LIMIT 1",
      {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: [level_id, access_id],
      }
    );
  }
}

export default new Access();
