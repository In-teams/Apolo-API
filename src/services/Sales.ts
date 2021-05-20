import { Request, Response } from "express";

class Auth {
  getTargetByWilayah(req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      const query = req.db.query("SELECT * FROM ms_sales_target LIMIT 10 OFFSET 0", (err: any, res: any) => {
        if (err) reject(err);
        resolve(res);
        // req.log(req, true, query.sql)
      });
    });
  }
}

export default new Auth();
