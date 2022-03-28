import {Response} from "express";
import {RedeemTransactionModel} from "../models/redeem-transaction";
import {RedeemRequest} from "../types/redeem-transaction-types";
import {RedeemTransactionFilters} from "../filters/redeem-transaction-filters";

export class RedeemController {
  filters = new RedeemTransactionFilters();

  async index(req: RedeemRequest, res: Response) {
    try {
      const [options, meta] = this.filters.filter(req.query);

      const {
        rows: data,
        count: total,
      } = await RedeemTransactionModel.findAndCountAll(options);

      const to = Math.min(total, meta.to);
      const last_page = Math.ceil(total / meta.per_page);

      return res.status(200).json({data, ...meta, to, total, last_page});
    } catch (e: any) {
      return res.status(500).json({message: e.message});
    }
  }
}
