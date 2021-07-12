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
import RedeemRoute from "./Redeem";
import RegistrationRoute from "./Registration";
import UserRoute from "./User";
import ExampleRoute from "./Example";
import PeriodeRoute from "./Periode";
import AppRoute from "./App";

class Index implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    const route = this.router
    route.use("/sales", SalesRoute);
    route.use("/area", AreaRoute);
    route.use("/region", RegionRoute);
    route.use("/wilayah", WilayahRoute);
    route.use("/outlet", OutletRoute);
    route.use("/redeem", RedeemRoute);
    route.use("/registration", RegistrationRoute);
    route.use("/periode", PeriodeRoute);
    route.use("/app", AppRoute);
    route.use("/user", UserRoute);
    route.use("/distributor", DistributorRoute);
    route.use("/example", Token.checkToken, ExampleRoute);
    route.use("/auth", AuthRoute);
  }
}

export default new Index().router;
