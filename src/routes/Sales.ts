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
    this.router.get("/summary/region", SalesRequest.get, SalesController.getSummaryByRegion); // summary by region
    this.router.get("/summary/distributor", SalesRequest.get, SalesController.getSummaryByDistributor); // summary by distributor
    this.router.get("/summary/area", SalesRequest.get, SalesController.getSummaryByArea); // summary by distributor
    this.router.get("/summary/asm", SalesRequest.get, SalesController.getSummaryByASM); // summary by ASM
    this.router.get("/summary/ass", SalesRequest.get, SalesController.getSummaryByASS); // summary by ASS
    this.router.get("/summary/achieve", SalesRequest.get, SalesController.getSummaryByAchieve); // summary by Achievement
    this.router.get("/summary/quarter", SalesRequest.get, SalesController.getSummaryPerQuarter); // summary per quarter (3 month)
    this.router.get("/summary/sem", SalesRequest.get, SalesController.getSummaryPerSemester); // summary by per semester (2 quarter)
    this.router.get("/summary/year", SalesRequest.get, SalesController.getSummaryPerYear); // summary by per year (2 semester)
    this.router.get("/summary/years", SalesRequest.get, SalesController.getSummaryPerYears); // summary by per year
  }
}

export default new Sales().router;
