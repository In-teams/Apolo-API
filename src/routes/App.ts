import { Router } from "express";
import AppController from "../controllers/App";
import IRouter from "../types/RouterInterface";

class App implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get("/month", AppController.getMonth);
    this.router.get("/quarter", AppController.getQuarter);
    this.router.get("/year", AppController.getYear);
  }
}

export default new App().router;
