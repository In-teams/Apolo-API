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
    this.router.get("/resume/registration", ReportRequest.get, ReportController.getRegistrationResumeReport);
    this.router.get("/resume/redeem", ReportRequest.get, ReportController.getRedeemResumeReport);
  }
}

export default new Report().router;
