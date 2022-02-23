import {NextFunction, Request, Response} from "express";
import joi from "joi";
import response from "../helpers/Response";

class Auth {
    get(req: Request, res: Response, next: NextFunction): any {
        const schema = joi.object({
            region_id: joi.string(),
            area_id: joi.string(),
            wilayah_id: joi.string(),
            outlet_id: joi.string(),
            distributor_id: joi.string(),
            ass_id: joi.string(),
            asm_id: joi.string(),
            salesman_id: joi.string(),
            sort: joi.string(),
            quarter_id: joi.number().valid(1, 2, 3, 4),
            month: joi.string(),
        });

        const {value, error} = schema.validate(req.query);
        if (error) {
            return response(res, false, null, error.message, 400);
        }
        req.validated = {...value, sort: value.sort || "ASC"};
        next();
    }

    show(req: Request, res: Response, next: NextFunction): any {
        const schema = joi.object({
            include: [joi.string(), joi.array().items("region", "distributor", "city", "registrations")],
        });

        const {value, error} = schema.validate(req.query);

        if (error) {
            return response(res, false, value, error.message, 400);
        }

        next();
    }

    getRedemption(req: Request, res: Response, next: NextFunction): any {
        const relations = [
            "status_transaksi",
            "program",
            "outlet",
            "outlet.distributor",
            "outlet.region",
            "outlet.city",
            "outlet.registration.periode",
            "items",
            "items.product",
        ]
        const schema = joi.object({
            attributes: joi.array(),
            include: [joi.string().valid(...relations), joi.array().items(...relations)],
        });

        const {value, error} = schema.validate(req.query);

        if (error) {
            return response(res, false, value, error.message, 400);
        }

        next();
    }
}

export default new Auth();
