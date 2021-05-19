import { Request } from "express";

class Auth {
  getUsers(req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      req.db.query("SELECT * FROM users", (err: any, res: any) => {
        if (err) reject(err);
        resolve(res);
      });
    });
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
