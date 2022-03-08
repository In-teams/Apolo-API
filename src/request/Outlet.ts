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
            include: [joi.string(), joi.array().items("registration", "region", "distributor", "city", "registrations")],
        });

        const {value, error} = schema.validate(req.query);

        if (error) {
            return response(res, false, value, error.message, 400);
        }

        next();
    }

    update(req: Request, res: Response, next: NextFunction): any {
        const schema = joi.object({
            include: [joi.string(), joi.array().items("registration", "region", "distributor", "city", "registrations")],
            "outlet_id": [joi.required(), joi.string()],
            "outlet_name": [joi.required(), joi.string()],
            "nama_konsumen": [joi.required(), joi.string()],
            "ektp": [joi.required(), joi.string()],
            "tanggal_lahir": [joi.date().allow(null, "", "0000-00-00")],
            "gender": [joi.string().max(1).min(1).allow("L", "P")],
            "alamat1": [joi.string()],
            "alamat2": [joi.string().optional().allow(null, "")],
            "alamat3": [joi.string().optional().allow(null, "")],
            "alamat4": [joi.string().optional().allow(null, "")],
            "rtrw": [joi.string().optional().allow(null, "")],
            "kelurahan": [joi.string()],
            "kecamatan": [joi.string()],
            "kabupaten": [joi.string()],
            "propinsi": [joi.string()],
            "kota": [joi.string().allow(null, "")],
            "kodepos": [joi.string()],
            "telepon1": [joi.string()],
            "telepon2": [joi.string().optional().allow(null, "")],
            "no_wa": [joi.string()],
            "namawali1": [joi.string().optional().allow(null, "")],
            "teleponwali1": [joi.string().optional().allow(null, "")],
            "namawali2": [joi.string().optional().allow(null, "")],
            "teleponwali2": [joi.string().optional().allow(null, "")],
            "email": [joi.string().optional().allow(null, "")],
            "formulir": [joi.string().optional().allow(null, "")],
            "scan": [joi.string().optional().allow(null, "")],
            "formulir_upload": [joi.string().optional().allow(null, "")],
            "valid": [joi.string().allow("Yes", "No").default("No")],
            "valid2": [joi.string().optional().allow(null, "")],
            "npwp": [joi.string()],
            "cluster": [joi.string().optional().allow(null, "")],
            "cluster2": [joi.string().optional().allow(null, "")],
            "nomor_rekening": [joi.string()],
            "nama_rekening": [joi.string()],
            "nama_bank": [joi.string()],
            "cabang_bank": [joi.string()],
            "kota_bank": [joi.string().optional().allow(null, "")],
            "nama_ektp": [joi.string().allow(null, "")],
            "nama_npwp": [joi.string().allow(null, "")],
            "jenis_badan": [joi.string().allow(null, "")],
        }).unknown(true);

        const {value, error} = schema.validate(req.body);

        if (error) {
            return res.status(422).json({
                data: value,
                errors: error.details,
                message: error.message
            });
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
