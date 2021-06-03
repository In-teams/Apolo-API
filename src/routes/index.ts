import { Router } from "express";
import Token from "../helpers/Token";
import IRouter from "../types/RouterInterface";
import AuthRoute from "./Auth";
import SalesRoute from "./Sales";
import AreaRoute from "./Area";
import RegionRoute from "./Region";
import WilayahRoute from "./Wilayah";
import DistributorRoute from "./Distributor";
import OutletRoute from "./Outlet";
import RegistrationRoute from "./Registration";
import UserRoute from "./User";
import ExampleRoute from "./Example";

class Index implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.use("/sales", SalesRoute);
    this.router.use("/area", AreaRoute);
    this.router.use("/region", RegionRoute);
    this.router.use("/wilayah", WilayahRoute);
    this.router.use("/outlet", OutletRoute);
    this.router.use("/registration", RegistrationRoute);
    this.router.use("/user", UserRoute);
    this.router.use("/distributor", DistributorRoute);
    this.router.use("/example", Token.checkToken, ExampleRoute);
    this.router.use("/auth", AuthRoute);
  }
}

export default new Index().router;
