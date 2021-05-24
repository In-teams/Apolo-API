import { Router } from "express";
import OutletController from "../controllers/Outlet";
import OutletRequest from "../request/Outlet";
import IRouter from "../types/RouterInterface";

class Outlet implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get("/", OutletRequest.get, OutletController.get);
  }
}

export default new Outlet().router;
