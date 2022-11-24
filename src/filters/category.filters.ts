import {FindAndCountOptions, Op, Sequelize} from "sequelize";
import keys from "lodash/keys";
import {PaginationMeta} from "../types/restful-types";

export class CategoryFilters {
  filter(query: any): [FindAndCountOptions, PaginationMeta] {
    const where: any = {};
    const limit = Number(query.per_page || 15);
    const page = Number(query.page || 1);
    const offset = page * limit - limit;
    const from = offset + 1;
    const to = offset + limit;
    const sort = query.sort;

    const order: any[] = [];

    if (sort) {
      order.push(
        sort
          .split(",")
          .map((v: string, i: number) =>
            i === 0 ? Sequelize.literal(`\`${v}\``) : v
          )
      );
    }

    for (const key of keys(query)) {
      switch (key) {
        case "page":
        case "per_page":
        case "include":
          continue;
        case "search":
          where.nama_category = {
            [Op.like]: `%${query[key]}%`,
          };
          break;
      }
    }

    return [
      { where, limit, offset, order, distinct: true },
      { page, per_page: limit, from, to },
    ];
  }
}
