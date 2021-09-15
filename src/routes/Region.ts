import { Router } from "express";
import RegionController from "../controllers/Region";
import RegionRequest from "../request/Region";
import IRouter from "../types/RouterInterface";

class Region implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    // this.router.get("/", RegionRequest.get, RegionController.get);
  }
}

export default new Region().router;
