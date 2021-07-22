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
    this.router.get("/summary/hr", SalesRequest.get, SalesController.getSummaryByHR); // summary by head region (wilayah)
    this.router.get("/summary/asm", SalesRequest.get, SalesController.getSummaryByASM); // summary by head region (wilayah)
    this.router.get("/summary/achieve", SalesRequest.get, SalesController.getSummaryByAchieve); // summary by head region (wilayah)
    this.router.get("/summary/quarter", SalesRequest.get, SalesController.getSummaryPerQuarter); // summary by head region (wilayah)
    this.router.get("/summary/sem", SalesRequest.get, SalesController.getSummaryPerSemester); // summary by head region (wilayah)
  }
}

export default new Sales().router;
