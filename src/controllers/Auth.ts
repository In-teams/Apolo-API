import { compareSync } from "bcrypt";
import { Request, Response } from "express";
import Token from "../helpers/Token";
import Service from "../services/Auth";

class Auth {
  async register(req: Request, res: Response): Promise<object | undefined> {
    try {
      await Service.addUser(req);
      req.log(false, "Success add user data [200]");
      return res.send({ msg: "User has been created" }).status(200);
    } catch (error) {
      console.log(error);
      req.log(true, JSON.stringify(error));
      return res.send({ msg: "internal server error" }).status(500);
    }
  }
  async login(req: Request, res: Response): Promise<object | undefined> {
    try {
      const data = await Service.getUser(req);
      if (data.length === 0)
        return res.status(404).send({ msg: "account not found" });
      if (!compareSync(req.validated.password, data[0].password))
        return res.status(422).send({ msg: "password not match" });
      req.log(false, "Success login [200]");
      delete data[0].password;

      data[0].token = Token.createToken(data[0]);
      return res.send(data).status(200);
    } catch (error) {
      console.log(error);
      req.log(true, JSON.stringify(error));
      return res.send({ msg: "internal server error" }).status(500);
    }
  }
}

export default new Auth();
