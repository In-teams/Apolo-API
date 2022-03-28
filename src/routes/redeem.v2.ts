import {Router} from "express";
import {RedeemController} from "../controllers/redeem-controller";
import {RedeemRequest} from "../request/redeem.request";

const RedeemRouter = Router();
const controller = new RedeemController();
const request = new RedeemRequest();

RedeemRouter.get("/", (req, res, next) => controller.index(req, res));
RedeemRouter.post(
    "/authorize",
    (req, res, next) => request.authorize(req, res, next),
    (req, res, next) => controller.authorize(req, res)
);

export default RedeemRouter;
