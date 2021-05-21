import { Request } from "express";

class Sales {
  getTargetByArea(req: Request): Promise<any> {
    const { area, month } = req.validated;
    return new Promise((resolve, reject) => {
      const query = req.db.query(
        "SELECT SUM(target_sales) as total FROM ms_sales_target st INNER JOIN ms_outlet o ON o.outlet_id = st.outlet_id WHERE o.area_id = ? AND st.month_target = ?;",
        [area, month],
        (err: any, res: any) => {
          if (err) reject(err);
          resolve(res);
          req.log(req, false, query.sql);
          console.log(query.sql);
        }
      );
    });
  }
  getTargetByDistributor(req: Request): Promise<any> {
    const { distributor, month } = req.validated;
    return new Promise((resolve, reject) => {
      const query = req.db.query(
        "SELECT SUM(target_sales) as total FROM ms_sales_target st INNER JOIN ms_outlet o ON o.outlet_id = st.outlet_id WHERE o.distributor_id = ? AND st.month_target = ?;",
        [distributor, month],
        (err: any, res: any) => {
          if (err) reject(err);
          resolve(res);
          req.log(req, false, query.sql);
          console.log(query.sql);
        }
      );
    });
  }
}

export default new Sales();
