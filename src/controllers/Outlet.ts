import {Request, Response} from "express";
import response from "../helpers/Response";
import Service from "../services/Outlet";
import {OutletModel} from "../models/outlet-model";
import {OutletRegistrationModel} from "../models/outlet-registration-model";
import {RedeemTransactionModel} from "../models/redeem-transaction";
import {RedeemStatusModel} from "../models/redeem-status";
import {RedeemItemModel} from "../models/redeem-items";
import {RewardModel} from "../models/reward";
import {ProgramModel} from "../models/program";
import {DistributorModel} from "../models/distributor-model";
import {CityModel} from "../models/city-model";
import {RegionModel} from "../models/region-model";
import {OutletRegistrationPeriodModel} from "../models/outlet-registration-period";

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
        const {id} = req.params;

        try {
            const data = await OutletModel.findByPk(id, {include: req.query.include})

            return res.status(200).json({data})
        } catch (error) {
            return res.status(500).json({error})
        }
    }

    async getRegistration(req: Request, res: Response) {
        const {id: outlet_id} = req.params;

        try {
            const data = await OutletRegistrationModel.findAll({where: {outlet_id}})

            return res.status(200).json({data})
        } catch (error) {
            return res.status(500).json({error})
        }
    }

    async getRedemptions(req: Request<{ id: string }, any, any, { page?: number; per_page?: number }>, res: Response) {
        const {id: no_id} = req.params;

        const {page = 1, per_page: limit = 10} = req.query

        const offset = limit * (Math.max(page - 1, 0))

        const to = limit * page;

        try {
            const {count: total, rows: data} = await RedeemTransactionModel.findAndCountAll({
                where: {no_id},
                limit,
                offset
            })

            return res.status(200).json({data, total, from: offset + 1, to})
        } catch (error) {
            console.error(error)
            return res.status(500).json({error})
        }
    }

    async getRedemption(req: Request<{ outletId: string; id: string }, any, any, { attributes?: any; include?: any }>, res: Response) {
        const {outletId: outlet_id, id} = req.params;

        let {attributes, include} = req.query

        if (include !== null && typeof include !== "string") {
            const modelMapping: { [s: string]: any } = {
                status_transaksi: RedeemStatusModel,
                items: RedeemItemModel,
                product: RewardModel,
                program: ProgramModel,
                outlet: OutletModel,
                distributor: DistributorModel,
                city: CityModel,
                region: RegionModel,
                registration: OutletRegistrationModel,
                periode: OutletRegistrationPeriodModel,
            }

            const mapper = (model: string): any => {
                if (model.includes(".")) {
                    const relations = model.split(".")

                    const related = relations.shift();

                    if (!related) {
                        return null;
                    }

                    return {model: modelMapping[related], as: related, include: mapper(relations.join("."))}
                }

                return {model: modelMapping[model], as: model};
            }

            include = include.map(mapper)
        }

        try {
            const data = await RedeemTransactionModel.findByPk(id, {attributes, include: include})

            return res.status(200).json({data})
        } catch (error) {
            console.error(error)
            return res.status(500).json({error})
        }
    }
}

export default new Outlet();
