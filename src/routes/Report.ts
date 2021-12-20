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
    this.router.get("/registration/export", ReportRequest.get, ReportController.exportRegistrationReport);
    this.router.get("/redeem", ReportRequest.get, ReportController.getRedeemReport);
    this.router.get("/redeem/export", ReportRequest.get, ReportController.exportRedeemReport);
    this.router.get("/point-activity", ReportRequest.get, ReportController.getPointActivityReport);
    this.router.get("/point-activity/export", ReportRequest.get, ReportController.exportPointActivityReport);
    this.router.get("/resume/registration", ReportRequest.get, ReportController.getRegistrationResumeReport);
    this.router.get("/resume/redeem", ReportRequest.get, ReportController.getRedeemResumeReport);
    this.router.get("/sales/sub-brand", ReportRequest.get, ReportController.getSalesReportPerSubBrand);
    this.router.get("/sales/category", ReportRequest.get, ReportController.getSalesReportPerCategory);
  }
}

export default new Report().router;
