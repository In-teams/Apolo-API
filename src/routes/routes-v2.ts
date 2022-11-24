import {Router} from "express";
import Token from "../helpers/Token";
import routes from "./sales-v2";
import ProvincesV2 from "./provinces.v2";
import IRouter from "../types/RouterInterface";
import RedeemRouter from "./redeem.v2";
import BrandRouter from "./brands.v2";

class RoutesV2 implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.use("/sales", Token.checkToken, routes);
    this.router.use("/provinces", Token.checkToken, ProvincesV2);
    this.router.use("/redeem", Token.checkToken, RedeemRouter);
    this.router.use("/brands", Token.checkToken, BrandRouter);
  }
}

export default new RoutesV2().router;
