import { Router } from "express";
import SalesController from "../controllers/Sales";
import SalesRequest from "../request/Sales";
import IRouter from "../types/RouterInterface";

class Sales implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get("/", SalesRequest.get, SalesController.get); // summary (all)
    this.router.get("/summary", SalesRequest.get, SalesController.getSummary); // summary by head region (wilayah)
  }
}

export default new Sales().router;
