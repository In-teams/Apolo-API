import { Router } from "express";
import DistributorController from "../controllers/Distributor";
import DistributorRequest from "../request/Distributor";
import IRouter from "../types/RouterInterface";

class Distributor implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    // this.router.get("/", DistributorRequest.get, DistributorController.get);
  }
}

export default new Distributor().router;
