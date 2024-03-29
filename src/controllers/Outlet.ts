import {Request, Response} from "express";
import response from "../helpers/Response";
import Service from "../services/Outlet";
import {OutletModel} from "../models/outlet-model";
import {OutletRegistrationModel} from "../models/outlet-registration-model";
import {RedeemItemModel, RedeemTransactionModel,} from "../models/redeem-transaction";
import {RedeemStatusModel} from "../models/redeem-status";
import {RewardModel} from "../models/reward";
import {ProgramModel} from "../models/program";
import {DistributorModel} from "../models/distributor-model";
import {SalesCityModel} from "../models/sales-city-model";
import {RegionModel} from "../models/region-model";
import {OutletRegistrationPeriodModel} from "../models/outlet-registration-period";
import {ProvinceModel} from "../models/admin-provice-model";
import {CityModel} from "../models/admin-city-model";
import {DistrictModel} from "../models/admin-district-model";
import {SubdistrictModel} from "../models/admin-subdistrict-model";

function mapRelations(include: any) {
  if (!include) {
    return undefined;
  }

  if (typeof include !== "string") {
    const modelMapping: { [s: string]: any } = {
      status_transaksi: RedeemStatusModel,
      items: RedeemItemModel,
      transaction: RedeemTransactionModel,
      product: RewardModel,
      program: ProgramModel,
      outlet: OutletModel,
      distributor: DistributorModel,
      sales_city: SalesCityModel,
      region: RegionModel,
      registration: OutletRegistrationModel,
      periode: OutletRegistrationPeriodModel,
      province: ProvinceModel,
      city: CityModel,
      district: DistrictModel,
      subdistrict: SubdistrictModel,
    };

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

class Outlet {
  async get(req: Request, res: Response): Promise<object | undefined> {
    try {
      let data: any[] = await Service.get(req);
      data = [
        {
          outlet_name: "ALL",
          outlet_id: null,
        },
        ...data,
      ];
      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }

  async getOutletActive(
    req: Request,
    res: Response
  ): Promise<object | undefined> {
    try {
      let active: any[] = await Service.getOutletActive(req);
      active = active.map((e: any) => ({
        ...e,
        percentage: ((+e.aktif / e.total_outlet) * 100).toFixed(2) + "%",
        percen: parseFloat(((+e.aktif / e.total_outlet) * 100).toFixed(2)),
      }));
      return response(res, true, active[0], null, 200);
    } catch (error) {
      return response(res, false, null, error, 500);
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const data = await OutletModel.findByPk(id, {
        include: req.query.include,
      });

      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async getRegistration(req: Request, res: Response) {
    const { id: outlet_id } = req.params;

    try {
      const data = await OutletRegistrationModel.findAll({
        where: { outlet_id },
      });

      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async getRedemptions(
    req: Request<
      { id: string },
      any,
      any,
      { page?: number; per_page?: number; include?: any }
    >,
    res: Response
  ) {
    const { id: no_id } = req.params;

    let { page = 1, per_page: limit = 10, include } = req.query;

    const offset = limit * Math.max(page - 1, 0);

    const to = limit * page;

    include = mapRelations(include);

    try {
      const { count: total, rows: data } =
        await RedeemTransactionModel.findAndCountAll({
          where: { no_id },
          limit,
          offset,
          include,
        });

      return res.status(200).json({ data, total, from: offset + 1, to });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  }

  async getRedemption(
    req: Request<
      { outletId: string; id: string },
      any,
      any,
      { attributes?: any; include?: any }
    >,
    res: Response
  ) {
    const { outletId: outlet_id, id } = req.params;

    let { attributes, include } = req.query;

    include = mapRelations(include);

    try {
      const data = await RedeemTransactionModel.findByPk(id, {
        attributes,
        include: include,
      });

      return res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  }

  async update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    const data = req.body;

    const outlet = await OutletModel.findByPk(id);

    if (outlet == null) {
      return res.status(404).json({ message: "Not Found." });
    }

    return res.status(200).json({ data: await outlet.update(data) });
  }
}

export default new Outlet();
