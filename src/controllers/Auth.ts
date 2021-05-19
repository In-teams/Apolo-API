import { Request, Response } from "express";
import Service from "../services/Auth";

class Auth {
  async post(req: Request, res: Response): Promise<object | undefined> {
    try {
      await Service.addUser(req);
      req.log(false, "Success add user data [200]");
      return res.send({msg: 'User has been created'}).status(200);
    } catch (error) {
      console.log(error)
      req.log(true, JSON.stringify(error));
      return res.send({msg: "internal server error"}).status(500);
    }
  }
}

export default new Auth();
