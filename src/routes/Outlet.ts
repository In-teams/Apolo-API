import {Router} from "express";
import OutletController from "../controllers/Outlet";
import OutletRequest from "../request/Outlet";
import IRouter from "../types/RouterInterface";

class Outlet implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get("/", OutletRequest.get, OutletController.get);
    this.router.get(
      "/active",
      OutletRequest.get,
      OutletController.getOutletActive
    ); // active outlet
    this.router.get("/:id", OutletRequest.show, OutletController.show);
    this.router.put("/:id", OutletRequest.update, OutletController.update);
    this.router.get("/:id/registrations", OutletController.getRegistration);
    this.router.get("/:id/redemptions", OutletController.getRedemptions);
    this.router.get(
      "/:outletId/redemptions/:id",
      OutletRequest.getRedemption,
      OutletController.getRedemption
    );
  }
}

export default new Outlet().router;
