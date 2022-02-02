import { Router } from "express";
import PeriodeController from "../controllers/Periode";
import PeriodeRequest from "../request/Periode";
import IRouter from "../types/RouterInterface";

class Periode implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.put("/:id", PeriodeRequest.update, PeriodeController.update);
    this.router.post("/", PeriodeRequest.create, PeriodeController.create);
    this.router.get("/", PeriodeController.get);
    this.router.delete("/:id", PeriodeRequest.delete, PeriodeController.delete);
  }
}

export default new Periode().router;
