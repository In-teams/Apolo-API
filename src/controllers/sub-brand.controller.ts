import {Request, Response} from "express";
import {SubBrandFilters} from "../filters/sub-brand.filters";
import {SubBrand} from "../models/sub-brand.model";

export class SubBrandController {
  filters = new SubBrandFilters();

  async index(req: Request, res: Response) {
    try {
      const [options, meta] = this.filters.filter(req.query);

      const { rows: data, count: total } = await SubBrand.findAndCountAll(
        options
      );

      const to = Math.min(total, meta.to);
      const last_page = Math.ceil(total / meta.per_page);

      return res.status(200).json({ data, ...meta, to, total, last_page });
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ message: e.message });
    }
  }
}
