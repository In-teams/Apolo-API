import {FindAndCountOptions, Op, Sequelize} from "sequelize";
import keys from "lodash/keys";
import {RedeemIndexQuery} from "../types/redeem-transaction-types";
import {PaginationMeta} from "../types/restful-types";
import {OutletModel} from "../models/outlet-model";
import {PurchaseRequestItemModel, RedeemItemModel,} from "../models/redeem-transaction";
import {RegionModel} from "../models/region-model";
import {DistributorModel, DistributorPicModel,} from "../models/distributor-model";

export class RedeemTransactionFilters {
  subQuery = `(SELECT COUNT(items.kd_transaksi) FROM trx_pr_barang AS items WHERE items.kd_transaksi = redeem_transaction.kd_transaksi)`;

  filter(query: RedeemIndexQuery): [FindAndCountOptions, PaginationMeta] {
    const where: any = {};
    const include: any[] = [];
    const limit = Number(query.per_page || 15);
    const page = Number(query.page || 1);
    const offset = page * limit - limit;
    const from = offset + 1;
    const to = offset + limit;

    const outletRelation: any = {
      model: OutletModel,
      as: "outlet",
      attributes: [
        "outlet_id",
        "outlet_name",
        "nama_konsumen",
        "region_id",
        "distributor_id",
        "city_id_alias",
      ],
      include: [],
      required: true,
    };

    const itemsRelation: any = {
      model: RedeemItemModel,
      as: "items",
      required: true,
    };

    const distributorRelation = {
      model: DistributorModel,
      as: "distributor",
      include: {
        model: DistributorPicModel,
        as: "pics",
        required: true,
      },
      required: true,
    };

    for (let key of keys(query)) {
      const distIsLoaded = outletRelation.include.some(
          ({as}: any) => as === "distributor"
      );

      switch (key) {
        case "page":
        case "per_page":
        case "include":
          continue;
        case "wilayah":
          outletRelation.include.push({
            model: RegionModel,
            as: "region",
            required: true,
          });
          where["$outlet.region.head_region_id$"] = query[key];
          break;
        case "region":
          where["$outlet.region_id$"] = query[key];
          break;
        case "distributor":
          where["$outlet.distributor_id$"] = query[key];
          break;
        case "area":
          where["$outlet.city_id_alias$"] = query[key];
          break;
        case "outlet":
          where.no_id = query[key];
          break;
        case "asm":
          if (!distIsLoaded) {
            outletRelation.include.push(distributorRelation);
          }

          where["$outlet.distributor.pics.asm_id$"] = query[key];
          break;
        case "ass":
          if (!distIsLoaded) {
            outletRelation.include.push(distributorRelation);
          }

          where["$outlet.distributor.pics.ass_id$"] = query[key];
          break;
        case "product":
          itemsRelation.where = {kd_produk: query[key]};
          break;
        case "dates":
          const dates = query[key];

          if (dates && dates.length == 2) {
            where.tgl_transaksi = {[Op.between]: dates};
          }

          break;
        case "has_pr":
          const opr = query[key] === "true" ? ">" : "<=";

          where[Op.and] = Sequelize.literal(`${this.subQuery} ${opr} 0`);

          if (opr === ">") {
            include.push({
              model: PurchaseRequestItemModel,
              as: "purchase_request_item",
              required: true,
            });
          }

          break;
      }
    }

    include.push(outletRelation);
    include.push(itemsRelation);

    return [
      {where, include, limit, offset, distinct: true},
      {page, per_page: limit, from, to},
    ];
  }
}
