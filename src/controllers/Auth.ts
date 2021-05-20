import { compareSync } from "bcrypt";
import { Request, Response } from "express";
import response from "../helpers/Response";
import Token from "../helpers/Token";
import Service from "../services/Auth";

class Auth {
  async register(req: Request, res: Response): Promise<object | undefined> {
    try {
      await Service.addUser(req);
      req.log(false, "Success add user data [200]");
      return response(res, true, "Account has been created", null, 200);
    } catch (error) {
      req.log(true, JSON.stringify(error));
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
  async login(req: Request, res: Response): Promise<object | undefined> {
    try {
      const data = await Service.getUser(req);
      if (data.length === 0)
        return response(res, false, "", "Account Not Found", 404);
      if (!compareSync(req.validated.password, data[0].password))
        return response(res, false, "", "Password Not Match", 422);
      req.log(false, "Success login [200]");
      delete data[0].password;

      data[0].token = Token.createToken(data[0]);
      return response(res, true, data[0], null, 200);
    } catch (error) {
      req.log(true, JSON.stringify(error));
      return response(res, false, null, JSON.stringify(error), 500);
    }
  }
}

export default new Auth();
