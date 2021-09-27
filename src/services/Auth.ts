import { Request } from "express";
import db from "../config/db";

class Auth {
  getUsers(req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      req.db.query("SELECT * FROM users", (err: any, res: any) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }
  getUserByUsername(req: Request) {
    const {username} = req.validated
    const query = db().select("*").from("ms_user").whereRaw('user_id = ?', [username])
    return query
  }
  getUser(req: Request) {
    const {username, password} = req.validated
    const query = db().select("*").from("ms_user").whereRaw('user_id = ? AND user_password = PASSWORD(?)', [username, password])
    return query
  }
  addUser(req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      req.db.query("INSERT INTO users (username, password) VALUES ?", [req.validated], (err: any, res: any) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }
}

export default new Auth();
