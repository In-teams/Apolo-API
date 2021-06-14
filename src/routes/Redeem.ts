import { Router } from "express";
import RedeemController from "../controllers/Redeem";
import RedeemRequest from "../request/Redeem";
import IRouter from "../types/RouterInterface";

class Redeem implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get("/", RedeemRequest.get, RedeemController.getPointSummary);
    this.router.get("/summary", RedeemRequest.get, RedeemController.getPointSummaryByHR);
    this.router.post("/", RedeemRequest.post, RedeemController.post);
    this.router.post("/validation", RedeemRequest.validation, RedeemController.post);
  }
}

export default new Redeem().router;
