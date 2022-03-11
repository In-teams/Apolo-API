import {Router} from "express";
import Token from "../helpers/Token";
import routes from "./sales-v2";
import ProvincesV2 from "./provinces.v2";
import IRouter from "../types/RouterInterface";

class RoutesV2 implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.use("/sales", Token.checkToken, routes);

    this.router.use("/provinces", Token.checkToken, ProvincesV2);
  }
}

export default new RoutesV2().router;
