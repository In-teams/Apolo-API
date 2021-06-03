import { Router } from "express";
import RegistrationController from "../controllers/Registration";
import RegistrationRequest from "../request/Registration";
import IRouter from "../types/RouterInterface";

class Registration implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get("/", RegistrationRequest.get, RegistrationController.get); // summary (all)
    this.router.get("/last", RegistrationRequest.get, RegistrationController.getLastRegistration); // last 5 registration
    this.router.get("/summary", RegistrationRequest.get, RegistrationController.getRegistrationSummary); // summary by head region (wilayah)
  }
}

export default new Registration().router;
