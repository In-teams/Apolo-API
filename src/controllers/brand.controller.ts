import {Request, Response} from "express";
import {BrandFilters} from "../filters/brand.filters";
import {Brand} from "../models/brand.model";

export class BrandController {
  filters = new BrandFilters();

  async index(req: Request, res: Response) {
    try {
      const [options, meta] = this.filters.filter(req.query);

      const { rows: data, count: total } = await Brand.findAndCountAll(options);

      const to = Math.min(total, meta.to);
      const last_page = Math.ceil(total / meta.per_page);

      return res.status(200).json({ data, ...meta, to, total, last_page });
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ message: e.message });
    }
  }
}
