import {Request} from "express";
import {QueryTypes} from "sequelize";
import db from "../config/db";

class Auth {
  async getUserByUsername(req: Request) {
    const { username } = req.validated;
    return await db.query("SELECT * FROM ms_user WHERE user_id = ?", {
      replacements: [username],
      raw: true,
      type: QueryTypes.SELECT,
    });
  }
  async getUser(req: Request) {
    const { username, password } = req.validated;
    return await db.query(
      "SELECT * FROM ms_user WHERE user_id = ? AND user_password = PASSWORD(?)",
      {
        replacements: [username, password],
        raw: true,
        type: QueryTypes.SELECT,
      }
    );
  }
}

export default new Auth();
