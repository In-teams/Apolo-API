import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import Route from "./routes";
import logging from "./helpers/Logging";
import database from "./config/db";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.secure();
    this.routes();
  }

  protected secure(): void {
    // database().connect((err) => console.log("database running well"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      req.log = logging.writeLog;
      req.db = database();
      next();
    });
  }

  protected routes(): void {
    const route = this.app;
    route.use("/api/v1", Route);
    route.get("*", (req: Request, res: Response) => {
      req.log(req, false, "Access unknown endpoint [404]");
      res.status(404).send("not found");
    });
    route.post("*", (req: Request, res: Response) => {
      req.log(req, false, "Access unknown endpoint [404]");
      res.status(404).send("not found");
    });
  }
}

const port: number = 2000;
const app = new App().app;

app.listen(port, () => console.log(`running on ${port}`));
