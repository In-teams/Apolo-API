import { Router, Request, Response } from "express";
import IRouter from "../types/RouterInterface";
import SalesRequest from "../request/Sales";
import SalesController from "../controllers/Sales";

class Sales implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get("/", SalesRequest.get, SalesController.get);
    this.router.get("/summary", SalesRequest.get, SalesController.getSummary);
  }
}

export default new Sales().router;
