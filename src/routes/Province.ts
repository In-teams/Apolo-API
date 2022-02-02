import { Router } from "express";
import ProvinceController from "../controllers/Province";
import ProvinceRequest from "../request/Province";
import IRouter from "../types/RouterInterface";

class Province implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get("/", ProvinceRequest.get, ProvinceController.get);
  }
}

export default new Province().router;
