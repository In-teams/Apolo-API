import {Router} from "express";
import {RedeemController} from "../controllers/redeem-controller";

const RedeemRouter = Router();
const controller = new RedeemController();

RedeemRouter.get("/", (req, res, next) => controller.index(req, res));

export default RedeemRouter;
