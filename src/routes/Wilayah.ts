import { Router } from "express";
import WilayahController from "../controllers/Wilayah";
import WilayahRequest from "../request/Wilayah";
import IRouter from "../types/RouterInterface";

class Wilayah implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    // this.router.get("/", WilayahRequest.get, WilayahController.get);
  }
}

export default new Wilayah().router;
