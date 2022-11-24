import {NextFunction, Request, Response} from "express";
import {sign, verify} from "jsonwebtoken";
import config from "../config/app";
import response from "./Response";

class Token {
  createToken(data: object, refresh?: boolean) {
    return sign({ data }, config.jwtKey);
    // return sign({ data }, config.jwtKey, {
    // 	expiresIn: refresh ? config.ExpRefreshKey : config.ExpKey,
    // });
  }

  checkToken(req: Request, res: Response, next: NextFunction): any {
    try {
      const token: string = req.headers.authorization || "";
      const check: any = verify(token, config.jwtKey);
      req.decoded = check.data;
      next();
    } catch (error: any) {
      if (error.name == "TokenExpiredError") {
        return response(res, false, null, "Token Expired", 401);
      }
      return response(res, false, null, "Invalid Token", 401);
    }
  }
}

export default new Token();
