import { Response } from "express";

class ResponseHelper {
  index(
    res: Response,
    success: boolean,
    data: any,
    error: any,
    statusCode: number
  ) {
    return res.status(statusCode).json({
      success,
      data,
      error,
      statusCode,
    });
  }
}

export default new ResponseHelper().index;
