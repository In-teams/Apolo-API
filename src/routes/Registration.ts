import {Router} from "express";
import RegistrationController from "../controllers/Registration";
import AccessMiddleware from "../helpers/AccessMiddleware";
import Upload from "../helpers/Upload";
import RegistrationRequest from "../request/Registration";
import IRouter from "../types/RouterInterface";

class Registration implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/status-list",
      RegistrationController.getRegistrationStatus
    ); // get status list
    // this.router.get("/formulir", RegistrationRequest.getForm, RegistrationController.printFormulir); // print formulir
    this.router.get("/", RegistrationRequest.get, RegistrationController.get); // summary (all)
    this.router.get(
      "/last",
      RegistrationRequest.get,
      RegistrationController.getLastRegistration
    ); // last 5 registration
    this.router.get(
      "/summary/month",
      RegistrationRequest.get,
      RegistrationController.getSummaryByMonth
    ); // summary (all)
    this.router.get(
      "/summary/hr",
      AccessMiddleware.wilayah,
      RegistrationRequest.get,
      RegistrationController.getRegistrationSummaryByHR
    ); // summary by head region (wilayah)
    this.router.get(
      "/summary/region",
      AccessMiddleware.region,
      RegistrationRequest.get,
      RegistrationController.getRegistrationSummaryByRegion
    ); // summary by region
    this.router.get(
      "/summary/area",
      AccessMiddleware.area,
      RegistrationRequest.get,
      RegistrationController.getRegistrationSummaryByArea
    ); // summary by area
    this.router.get(
      "/summary/distributor",
      AccessMiddleware.distributor,
      RegistrationRequest.get,
      RegistrationController.getRegistrationSummaryByDistributor
    ); // summary by distributor
    this.router.get(
      "/summary/outlet",
      RegistrationRequest.get,
      RegistrationController.getRegistrationSummaryByOutlet
    ); // summary by outlet
    this.router.get(
      "/summary/asm",
      AccessMiddleware.area,
      RegistrationRequest.get,
      RegistrationController.getRegistrationSummaryByASM
    ); // summary by asm
    this.router.get(
      "/summary/ass",
      AccessMiddleware.distributor,
      RegistrationRequest.get,
      RegistrationController.getRegistrationSummaryByASS
    ); // summary by ass
    this.router.get(
      "/summary/level",
      RegistrationRequest.get,
      RegistrationController.getRegistrationSummaryByLevel
    ); // summary by level
    this.router.post(
      "/",
      RegistrationRequest.post,
      RegistrationController.post
    ); // upload registration file
    this.router.post(
      "/bulky",
      RegistrationRequest.postBulky,
      Upload("registration"),
      RegistrationController.postBulky
    ); // upload registration file
    this.router.put(
      "/:outlet_id",
      RegistrationRequest.update,
      RegistrationController.update
    ); // update outlet data
    this.router.get(
      "/:outlet_id",
      RegistrationRequest.getOutletData,
      RegistrationController.getOutletData
    ); // get outlet data
    this.router.post(
      "/validation",
      RegistrationRequest.validation,
      RegistrationController.validation
    ); // registration file validation
    this.router.get(
      "/history/:file_id",
      RegistrationRequest.getHistory,
      RegistrationController.getHistory
    ); // get history validation
    this.router.get(
      "/file/:outlet_id",
      RegistrationRequest.getFile,
      RegistrationController.getFile
    ); // get registration file
  }
}

export default new Registration().router;
