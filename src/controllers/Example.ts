import { Request, Response } from "express";
import Service from "../services/Example";

class Example {
  async post(req: Request, res: Response): Promise<object | undefined> {
    try {
      const result = await Service.postData();
      req.log(req, false, "Success post data [200]");
      return res.send(result).status(200);
    } catch (error) {
      req.log(req, true, JSON.stringify(error));
      return res.send({msg: "internal server error"}).status(500);
    }
  }
}

export default new Example();
