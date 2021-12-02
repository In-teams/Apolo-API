import { Router } from "express";
import ReportController from "../controllers/Report";
import ReportRequest from "../request/Report";
import IRouter from "../types/RouterInterface";

class Report implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get("/registration", ReportRequest.get, ReportController.getRegistrationReport);
    this.router.get("/redeem", ReportRequest.get, ReportController.getRedeemReport);
    this.router.get("/resume/registration", ReportRequest.get, ReportController.getRegistrationResumeReport);
    this.router.get("/resume/redeem", ReportRequest.get, ReportController.getRedeemResumeReport);
    this.router.get("/sales/sub-brand", ReportRequest.get, ReportController.getSalesReportPerSubBrand);
    this.router.get("/sales/category", ReportRequest.get, ReportController.getSalesReportPerSubBrand);
  }
}

export default new Report().router;
