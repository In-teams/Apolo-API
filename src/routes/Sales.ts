import {Router} from "express";
import SalesController from "../controllers/Sales";
import AccessMiddleware from "../helpers/AccessMiddleware";
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
    this.router.get(
      "/summary/hr",
      AccessMiddleware.wilayah,
      SalesRequest.get,
      SalesController.getSummaryByHR
    ); // summary by head region (wilayah)
    this.router.get(
      "/summary/region",
      AccessMiddleware.region,
      SalesRequest.get,
      SalesController.getSummaryByRegion
    ); // summary by region
    this.router.get(
      "/summary/distributor",
      AccessMiddleware.distributor,
      SalesRequest.get,
      SalesController.getSummaryByDistributor
    ); // summary by distributor
    this.router.get(
      "/summary/outlet",
      SalesRequest.get,
      SalesController.getSummaryByOutlet
    ); // summary by outlet
    this.router.get(
      "/summary/area",
      AccessMiddleware.area,
      SalesRequest.get,
      SalesController.getSummaryByArea
    ); // summary by area
    this.router.get(
      "/summary/asm",
      AccessMiddleware.area,
      SalesRequest.get,
      SalesController.getSummaryByASM
    ); // summary by ASM
    this.router.get(
      "/summary/ass",
      AccessMiddleware.distributor,
      SalesRequest.get,
      SalesController.getSummaryByASS
    ); // summary by ASS
    this.router.get(
      "/summary/achieve",
      SalesRequest.get,
      SalesController.getSummaryByAchieve
    ); // summary by Achievement
    this.router.get(
      "/summary/quarter",
      SalesRequest.get,
      SalesController.getSummaryPerQuarter
    ); // summary per quarter (3 month)
    this.router.get(
      "/summary/sem",
      SalesRequest.get,
      SalesController.getSummaryPerSemester
    ); // summary by per semester (2 quarter)
    this.router.get(
      "/summary/year",
      SalesRequest.get,
      SalesController.getSummaryPerYear
    ); // summary by per year (2 semester)
    this.router.get(
      "/summary/years",
      SalesRequest.get,
      SalesController.getSummaryPerYears
    ); // summary by per year
    this.router.get("/summary/coba", SalesRequest.get, SalesController.coba); // summary by per year
  }
}

export default new Sales().router;
