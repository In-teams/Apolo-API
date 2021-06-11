import { Router } from "express";
import PoinController from "../controllers/Poin";
import PoinRequest from "../request/Poin";
import IRouter from "../types/RouterInterface";

class Poin implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get("/", PoinRequest.get, PoinController.getPointSummary);
    this.router.get("/summary", PoinRequest.get, PoinController.getPointSummaryByHR);
  }
}

export default new Poin().router;
