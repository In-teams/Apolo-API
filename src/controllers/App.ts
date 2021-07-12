import { Request, Response } from "express";
import response from "../helpers/Response";

class App {
  async getMonth(req: Request, res: Response): Promise<object | undefined> {
    try {
      const data: object[] = [
          {id: 1, month: "JANUARY"},
          {id: 2, month: "FEBRUARY"},
          {id: 3, month: "MARCH"},
          {id: 4, month: "APRIL"},
          {id: 5, month: "MAY"},
          {id: 6, month: "JUNE"},
          {id: 7, month: "JULY"},
          {id: 8, month: "AUGUST"},
          {id: 9, month: "SEPTEMBER"},
          {id: 10, month: "OCTOBER"},
          {id: 11, month: "NOVEMBER"},
          {id: 12, month: "DECEMBER"},
      ]
      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
  async getQuarter(req: Request, res: Response): Promise<object | undefined> {
    try {
      const data: object[] = [
          {id: 1, quarter: "QUARTER 1"},
          {id: 2, quarter: "QUARTER 2"},
          {id: 3, quarter: "QUARTER 3"},
          {id: 4, quarter: "QUARTER 4"},
      ]
      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
  async getYear(req: Request, res: Response): Promise<object | undefined> {
    try {
      const data: object[] = [
          {id: 1, year: new Date().getFullYear() - 1},
          {id: 2, year: new Date().getFullYear()},
          {id: 3, year: new Date().getFullYear() + 1},
      ]
      return response(res, true, data, null, 200);
    } catch (error) {
      return response(res, false, null, JSON.stringify(error.message), 500);
    }
  }
}

export default new App();
