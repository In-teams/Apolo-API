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
    this.router.get("/status-list", RegistrationController.getRegistrationStatus); // get status list
    this.router.get("/", RegistrationRequest.get, RegistrationController.get); // summary (all)
    this.router.get("/last", RegistrationRequest.get, RegistrationController.getLastRegistration); // last 5 registration
    this.router.get("/summary/hr", RegistrationRequest.get, RegistrationController.getRegistrationSummaryByHR); // summary by head region (wilayah)
    this.router.get("/summary/region", RegistrationRequest.get, RegistrationController.getRegistrationSummaryByRegion); // summary by region
    this.router.get("/summary/area", RegistrationRequest.get, RegistrationController.getRegistrationSummaryByArea); // summary by area
    this.router.get("/summary/distributor", RegistrationRequest.get, RegistrationController.getRegistrationSummaryByDistributor); // summary by distributor
    this.router.get("/summary/outlet", RegistrationRequest.get, RegistrationController.getRegistrationSummaryByOutlet); // summary by distributor
    this.router.post("/", RegistrationRequest.post, RegistrationController.post); // upload registration file
    this.router.put("/:outlet_id", RegistrationRequest.update, RegistrationController.update); // update outlet data
    this.router.get("/:outlet_id", RegistrationRequest.getOutletData, RegistrationController.getOutletData); // get outlet data
    this.router.post("/validation", RegistrationRequest.validation, RegistrationController.validation); // registration file validation
    this.router.get("/history/:file_id", RegistrationRequest.getHistory, RegistrationController.getHistory); // get history validation
    this.router.get("/file/:outlet_id", RegistrationRequest.getFile, RegistrationController.getFile); // get registration file
  }
}

export default new Registration().router;
