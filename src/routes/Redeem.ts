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
    this.router.get("/last", RedeemRequest.get, RedeemController.getLastRedeem);
    this.router.get("/summary/month", RedeemRequest.get, RedeemController.getPointSummaryByMonth);
    this.router.get("/summary/hr", RedeemRequest.get, RedeemController.getPointSummaryByHR);
    this.router.get("/summary/region", RedeemRequest.get, RedeemController.getPointSummaryByRegion);
    this.router.get("/summary/area", RedeemRequest.get, RedeemController.getPointSummaryByArea);
    this.router.get("/summary/distributor", RedeemRequest.get, RedeemController.getPointSummaryByDistributor);
    this.router.get("/summary/outlet", RedeemRequest.get, RedeemController.getPointSummaryByOutlet);
    this.router.get("/summary/asm", RedeemRequest.get, RedeemController.getPointSummaryByASM);
    this.router.get("/summary/ass", RedeemRequest.get, RedeemController.getPointSummaryByASS);
    // this.router.get("/product", RedeemRequest.getProduct,RedeemController.getproduct);
    // this.router.post("/", RedeemRequest.post, RedeemController.post);
    // this.router.post("/checkout", RedeemRequest.checkout, RedeemController.checkout);
    // this.router.post("/validation", RedeemRequest.validation, RedeemController.validation);
  }
}

export default new Redeem().router;
