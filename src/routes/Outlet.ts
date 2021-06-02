import { Router } from "express";
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
    this.router.get("/transaksi", OutletRequest.get, OutletController.getOutletTransaction);
    this.router.get("/registrasi", OutletRequest.get, OutletController.getOutletRegistrasi);
    this.router.get("/registrasi/last", OutletRequest.get, OutletController.getLastOutletRegistrasi);
    this.router.get("/registrasi/summary", OutletRequest.get, OutletController.getOutletRegistrasiSummary);
    this.router.get("/poin-reward", OutletRequest.get, OutletController.getOutletPoint);
  }
}

export default new Outlet().router;
