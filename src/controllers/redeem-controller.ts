import {Response} from "express";
import {PurchaseRequestItemModel, PurchaseRequestModel, RedeemTransactionModel,} from "../models/redeem-transaction";
import {AuthorizeRedeemRequest, RedeemRequest,} from "../types/redeem-transaction-types";
import {CountPRSubQuery, RedeemTransactionFilters,} from "../filters/redeem-transaction-filters";
import {Op, Sequelize} from "sequelize";
import {padStart} from "lodash";

export class RedeemController {
  filters = new RedeemTransactionFilters();

  async index(req: RedeemRequest, res: Response) {
    try {
      const [options, meta] = this.filters.filter(req.query);

      const { rows: data, count: total } =
        await RedeemTransactionModel.findAndCountAll(options);

      const to = Math.min(total, meta.to);
      const last_page = Math.ceil(total / meta.per_page);

      return res.status(200).json({ data, ...meta, to, total, last_page });
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ message: e.message });
    }
  }

  async authorize(req: AuthorizeRedeemRequest, res: Response) {
    try {
      const { transactions } = req.body;

      const validTransactions = await RedeemTransactionModel.findAll({
        attributes: ["kd_transaksi"],
        where: {
          kd_transaksi: { [Op.in]: transactions },
          [Op.and]: Sequelize.literal(`${CountPRSubQuery} <= 0`),
        },
      });

      if (!validTransactions || validTransactions.length === 0) {
        return res.status(400).json({
          message: "Transactions already authorized.",
          data: { transactions },
        });
      }

      const latestPurchaseRequest = await PurchaseRequestModel.findOne({
        attributes: ["kode_pr"],
        order: [["kode_pr", "desc"]],
      });

      const runningNumber =
        Number(
          latestPurchaseRequest == null
            ? 0
            : // @ts-ignore
              latestPurchaseRequest.kode_pr.replace("LV", "")
        ) + 1;

      const kode_pr = "LV" + padStart(String(runningNumber), 4, "0");

      const data = await PurchaseRequestModel.create({ kode_pr });

      const items = await PurchaseRequestItemModel.bulkCreate(
        validTransactions.map(({ kd_transaksi }: any) => ({
          kode_pr,
          kd_transaksi,
        }))
      );

      res.status(201).json({
        data: { ...data.toJSON(), items },
        skipped: transactions.filter(
          (
            item // @ts-ignore
          ) => !items.some((i) => i.kd_transaksi === item)
        ),
      });
    } catch (e: any) {
      return res.status(500).json({ message: e.message });
    }
  }
}
