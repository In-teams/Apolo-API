import { Router, Request, Response } from "express";
import IRouter from "../types/RouterInterface";
import PeriodeRequest from '../request/Periode'
import PeriodeController from '../controllers/Periode'

class Periode implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes()
  }

  public routes(): void {
    this.router.post("/", PeriodeRequest.create, PeriodeController.create);
  }
}

export default new Periode().router
