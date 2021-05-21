import { Router } from "express";
import Token from "../helpers/Token";
import IRouter from "../types/RouterInterface";
import AuthRoute from "./Auth";
import SalesRoute from "./Sales";
import AreaRoute from "./Area";
import ExampleRoute from "./Example";

class Index implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes() :void {
    this.router.use("/sales", SalesRoute);
    this.router.use("/area", AreaRoute);
    this.router.use("/example", Token.checkToken, ExampleRoute);
    this.router.use("/auth", AuthRoute);
  }
}

export default new Index().router;
