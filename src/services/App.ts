import { QueryTypes } from "sequelize";
import db from "../config/db";

class App {
  async getBanks(): Promise<any> {
    return await db.query(
      "SELECT * FROM indonesia.ms_bank",
      {
        raw: true,
        type: QueryTypes.SELECT,
        // replacements: [level_id, access_id],
      }
    );
  }
}

export default new App();
