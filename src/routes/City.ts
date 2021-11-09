import { Router } from "express";
import CityController from "../controllers/City";
import CityRequest from "../request/City";
import IRouter from "../types/RouterInterface";

class City implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get("/", CityRequest.get, CityController.get);
  }
}

export default new City().router;
