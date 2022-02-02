import { Router } from "express";
import SubDistrictController from "../controllers/SubDistrict";
import SubDistrictRequest from "../request/SubDistrict";
import IRouter from "../types/RouterInterface";

class SubDistrict implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get("/", SubDistrictRequest.get, SubDistrictController.get);
  }
}

export default new SubDistrict().router;
