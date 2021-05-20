import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { ExpJwtKey, jwtKey } from "../config/app";
import response from "./Response";

class Token {
  createToken(data: object) {
    return sign({ data }, jwtKey, { expiresIn: ExpJwtKey });
  }

  checkToken(req: Request, res: Response, next: NextFunction): any {
    try {
      let token: string = req.headers.authorization || "";
      const check = verify(token, jwtKey);
      console.log(check);
      next();
    } catch (error) {
      if (error.name == "TokenExpiredError") {
        return response(res, false, null, "Token Expired", 401);
      }
      return response(res, false, null, "Invalid Token", 401);
    }
  }
}

export default new Token();
