import { Router } from "express";
import DistrictController from "../controllers/District";
import DistrictRequest from "../request/District";
import IRouter from "../types/RouterInterface";

class District implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get("/", DistrictRequest.get, DistrictController.get);
  }
}

export default new District().router;
