import { Router } from "express";
import Token from "../helpers/Token";
import IRouter from "../types/RouterInterface";
import AuthRoute from "./Auth";
import SalesRoute from "./Sales";
import AreaRoute from "./Area";
import RegionRoute from "./Region";
import ProvinsiRoute from "./Province";
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
    const route = this.router;
    route.use("/sales", Token.checkToken, SalesRoute);
    route.use("/area", Token.checkToken, AreaRoute);
    route.use("/region", Token.checkToken, RegionRoute);
    route.use("/provinces", Token.checkToken, ProvinsiRoute);
    route.use("/wilayah", Token.checkToken, WilayahRoute);
    route.use("/outlet", Token.checkToken, OutletRoute);
    route.use("/redeem", Token.checkToken, RedeemRoute);
    route.use("/registration", Token.checkToken, RegistrationRoute);
    route.use("/periode", Token.checkToken, PeriodeRoute);
    route.use("/app", Token.checkToken, AppRoute);
    route.use("/user", Token.checkToken, UserRoute);
    route.use("/distributor", Token.checkToken, DistributorRoute);
    route.use("/example", Token.checkToken, ExampleRoute);
    route.use("/auth", AuthRoute);
  }
}

export default new Index().router;
