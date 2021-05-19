import { Router, Request, Response } from "express";
import IRouter from "../types/RouterInterface";
import AuthRequest from '../request/Auth'
import AuthController from '../controllers/Auth'

class Auth implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes()
  }

  public routes(): void {
    this.router.post("/", AuthRequest.login, AuthController.post);
  }
}

export default new Auth().router
