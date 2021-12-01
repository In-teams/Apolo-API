import { NextFunction, Request, Response } from "express";
import response from "./Response";

class SalesMiddleware {
  distributor(req: Request, res: Response, next: NextFunction) {
    let { level } = req.decoded;
    level = parseInt(level);
    // 3 for asm
    if (level === 1 || level <= 3) {
      next();
    } else {
      return response(res, true, [], null, 200);
    }
  }
  area(req: Request, res: Response, next: NextFunction) {
    let { level } = req.decoded;
    level = parseInt(level);
    // 3 for region manager
    if (level === 1 || level <= 2) {
      next();
    } else {
      return response(res, true, [], null, 200);
    }
  }
  region(req: Request, res: Response, next: NextFunction) {
    let { level } = req.decoded;
    level = parseInt(level);
    // just national
    if (level === 1) {
      next();
    } else {
      return response(res, true, [], null, 200);
    }
  }
  wilayah(req: Request, res: Response, next: NextFunction) {
    let { level } = req.decoded;
    level = parseInt(level);
    // just national
    if (level === 1) {
      next();
    } else {
      return response(res, true, [], null, 200);
    }
  }
}

export default new SalesMiddleware();
