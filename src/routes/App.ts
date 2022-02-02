import { Router } from "express";
import AppController from "../controllers/App";
import AppRequest from "../request/App";
import IRouter from "../types/RouterInterface";

class App implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get("/month", AppRequest.get, AppController.getMonth);
    this.router.get("/quarter", AppRequest.get, AppController.getQuarter);
    this.router.get("/year", AppController.getYear);
    this.router.get("/bank", AppController.getBanks);
  }
}

export default new App().router;
