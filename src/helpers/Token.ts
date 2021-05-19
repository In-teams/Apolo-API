import { NextFunction, Request } from "express";
import { sign, Secret } from "jsonwebtoken";
import { ExpJwtKey, jwtKey } from "../config/app";

class Token {
  createToken(data: object) {
    return sign({ data }, jwtKey, { expiresIn: ExpJwtKey });
  }

  checkToken(req: Request, res: Response, next: NextFunction) {
    try {
      let token = req.headers.authorization;
      
    } catch (error) {
      if (error.name == "TokenExpiredError") {
        // return res.status(401).json({
        //   message: "Token Expired, Please login to get new token",
        // });
      }
      //   return res.status(401).json({
      //     message: "Invalid Token",
      //   });
    }
  }
}

export default new Token();
