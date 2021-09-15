import { Router } from "express";
import UserController from "../controllers/User";
import UserRequest from "../request/User";
import IRouter from "../types/RouterInterface";

class User implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    // this.router.get("/", UserRequest.get, UserController.get);
  }
}

export default new User().router;
