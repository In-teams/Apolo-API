import {Request, Response} from "express";
import response from "../helpers/Response";
import Token from "../helpers/Token";
import Service from "../services/Auth";

class Auth {
  async login(req: Request, res: Response): Promise<object | undefined> {
    try {
      const data: any[] = await Service.getUserByUsername(req);
      if (data.length === 0)
        return response(res, false, null, "Account Not Found", 404);
      const passwordCheck = await Service.getUser(req);
      if (passwordCheck.length === 0)
        return response(res, false, null, "Password wrong", 404);
      delete data[0].user_password;
      data[0].token = Token.createToken(data[0]);
      data[0].refreshtoken = Token.createToken(data[0], true);
      return response(res, true, data[0], null, 200);
    } catch (error) {
      console.log(error);
      return response(res, false, null, error, 500);
    }
  }
}

export default new Auth();
