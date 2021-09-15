import { Router } from "express";
import AreaController from "../controllers/Area";
import AreaRequest from "../request/Area";
import IRouter from "../types/RouterInterface";

class Area implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    // this.router.get("/", AreaRequest.get, AreaController.get);
  }
}

export default new Area().router;
