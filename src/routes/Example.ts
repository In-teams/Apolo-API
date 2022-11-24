import {Router} from "express";
import IRouter from "../types/RouterInterface";
import ExRequest from "../request/Example";
import ExController from "../controllers/Example";

class Example implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.post("/", ExRequest.post, ExController.post);
  }
}

export default new Example().router;
