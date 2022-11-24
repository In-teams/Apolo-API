import {Request, Response} from "express";
import response from "../helpers/Response";
import Service from "../services/City";
import {CityModel} from "../models/admin-city-model";

function mapRelations(include: any) {
  if (!include) {
    return undefined;
  }

  if (typeof include !== "string") {
    const modelMapping: { [s: string]: any } = {};

    const mapper = (model: string): any => {
      if (model.includes(".")) {
        const relations = model.split(".");

        const related = relations.shift();

        if (!related) {
          return null;
        }

        return {
          model: modelMapping[related],
          as: related,
          include: mapper(relations.join(".")),
        };
      }

      return { model: modelMapping[model], as: model };
    };

    include = include.map(mapper);
  }

  return include;
}

class City {
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      const data: any[] =
        Object.keys(req.validated).length > 0
          ? await Service.get(req.validated)
          : [];
      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }

  async index(
    req: Request<
      any,
      any,
      any,
      { page?: number; per_page?: number; include?: any }
    >,
    res: Response
  ) {
    try {
      let { page = 1, per_page: limit = 10, include } = req.query;

      const offset = limit * Math.max(page - 1, 0);

      const to = limit * page;

      include = mapRelations(include);

      const { rows: data, count: total } = await CityModel.findAndCountAll({
        offset,
        limit,
        include,
      });

      return res.status(200).json({ data, total, from: offset + 1, to });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}

export default new City();
