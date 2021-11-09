import { Router } from "express";
import ProvinsiController from "../controllers/Provinsi";
import ProvinsiRequest from "../request/Provinsi";
import IRouter from "../types/RouterInterface";

class Provinsi implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get("/", ProvinsiRequest.get, ProvinsiController.get);
  }
}

export default new Provinsi().router;
