import {Request, Response} from "express";
import response from "../helpers/Response";
import Service from "../services/Province";
import {ProvinceModel} from "../models/admin-provice-model";
import {Op} from "sequelize";
import {LengthAwarePaginationQuery} from "../models/length-aware-pagination-query";
import {CityModel} from "../models/admin-city-model";
import {DistrictModel} from "../models/admin-district-model";
import {SubdistrictModel} from "../models/admin-subdistrict-model";
import {mapRelations} from "./map-relations";

interface ProvincesQuery extends LengthAwarePaginationQuery {
}

const mapping: { [s: string]: any } = {
  kabupaten: CityModel,
  kecamatan: DistrictModel,
  kelurahan: SubdistrictModel,
};

class Provinsi {
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data: any[] = await Service.get(req.validated);
      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }

  async index(req: Request<any, any, any, ProvincesQuery>, res: Response) {
    try {
      let {search = "", page = 1, per_page: limit = 15, include} = req.query;

      limit = Number(limit);
      page = Number(page);

      const to = limit * page;
      const offset = to - limit;

      include = mapRelations(include, mapping);

      const {rows: data, count: total} = await ProvinceModel.findAndCountAll({
        where: {name: {[Op.like]: `%${search}%`}},
        limit,
        offset,
        include,
      });

      return res.status(200).json({
        data,
        total,
        from: offset + 1,
        to: Math.min(to, total),
        page,
        per_page: limit,
      });
    } catch (error) {
      return res.status(500).json({error});
    }
  }

  async show(
      req: Request<{ id?: string }, any, any, { include: any }>,
      res: Response
  ) {
    try {
      let {include} = req.query;

      include = mapRelations(include, mapping);

      const data = await ProvinceModel.findByPk(req.params.id, {include});

      if (!data) {
        return res.status(404).json({message: "Not found."});
      }

      return res.status(200).json({data});
    } catch (error) {
      return res.status(500).json({error});
    }
  }

  async cities(
      req: Request<{ id?: string }, any, any, LengthAwarePaginationQuery>,
      res: Response
  ) {
    try {
      let {id} = req.params;

      let {search = "", page = 1, per_page: limit = 15, include} = req.query;

      limit = Number(limit);
      page = Number(page);

      const to = limit * page;
      const offset = to - limit;

      include = mapRelations(include, mapping);

      const {rows: data, count: total} = await CityModel.findAndCountAll({
        where: {provinces_id: id, name: {[Op.like]: `%${search}%`}},
        limit,
        offset,
        include,
      });

      return res.status(200).json({
        data,
        total,
        from: offset + 1,
        to: Math.min(to, total),
        page,
        per_page: limit,
      });
    } catch (error) {
      return res.status(500).json({error});
    }
  }

  async city(
      req: Request<{ id?: string; cityId?: string }, any, any, { include?: any }>,
      res: Response
  ) {
    try {
      let {include} = req.query;

      include = mapRelations(include, mapping);

      const data = await CityModel.findByPk(req.params.cityId, {include});

      // @ts-ignore
      if (!data || data.provinces_id !== req.params.id) {
        return res.status(404).json({message: "Not found."});
      }

      return res.status(200).json({data});
    } catch (error) {
      return res.status(500).json({error});
    }
  }

  async districts(
      req: Request<{ id?: string; cityId?: string },
          any,
          any,
          LengthAwarePaginationQuery>,
      res: Response
  ) {
    try {
      let {cityId} = req.params;

      let {search = "", page = 1, per_page: limit = 15, include} = req.query;

      limit = Number(limit);
      page = Number(page);

      const to = limit * page;
      const offset = to - limit;

      include = mapRelations(include, mapping);

      const {rows: data, count: total} = await DistrictModel.findAndCountAll({
        where: {
          cities_id: cityId,
          name: {[Op.like]: `%${search}%`},
        },
        limit,
        offset,
        include,
      });

      return res.status(200).json({
        data,
        total,
        from: offset + 1,
        to: Math.min(to, total),
        page,
        per_page: limit,
      });
    } catch (error) {
      return res.status(500).json({error});
    }
  }

  async district(
      req: Request<{ id?: string; cityId?: string; districtId?: string },
          any,
          any,
          { include?: any }>,
      res: Response
  ) {
    try {
      let {include} = req.query;

      include = mapRelations(include, mapping);

      const data = await DistrictModel.findByPk(req.params.districtId, {
        include,
      });

      // @ts-ignore
      if (!data || data.cities_id !== req.params.cityId) {
        return res.status(404).json({message: "Not found."});
      }

      return res.status(200).json({data});
    } catch (error) {
      return res.status(500).json({error});
    }
  }

  async subdistricts(
      req: Request<{ id?: string; cityId?: string; districtId?: string },
          any,
          any,
          LengthAwarePaginationQuery>,
      res: Response
  ) {
    try {
      let {districtId} = req.params;

      let {search = "", page = 1, per_page: limit = 15, include} = req.query;

      limit = Number(limit);
      page = Number(page);

      const to = limit * page;
      const offset = to - limit;

      include = mapRelations(include, mapping);

      const {
        rows: data,
        count: total,
      } = await SubdistrictModel.findAndCountAll({
        where: {
          districts_id: districtId,
          name: {[Op.like]: `%${search}%`},
        },
        limit,
        offset,
        include,
      });

      return res.status(200).json({
        data,
        total,
        from: offset + 1,
        to: Math.min(to, total),
        page,
        per_page: limit,
      });
    } catch (error) {
      return res.status(500).json({error});
    }
  }

  async subdistrict(
      req: Request<{ id?: string; cityId?: string; districtId?: string; subdistrictId?: string },
          any,
          any,
          { include?: any }>,
      res: Response
  ) {
    try {
      let {include} = req.query;

      include = mapRelations(include, mapping);

      const data = await SubdistrictModel.findByPk(req.params.subdistrictId, {
        include,
      });

      // @ts-ignore
      if (!data || data.districts_id !== req.params.districtId) {
        return res.status(404).json({message: "Not found."});
      }

      return res.status(200).json({data});
    } catch (error) {
      return res.status(500).json({error});
    }
  }
}

export default new Provinsi();
