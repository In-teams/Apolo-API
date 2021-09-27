import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import database from "./config/db";
import Route from "./routes";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.secure();
    this.routes();
  }

  protected secure(): void {
    // database().connect((err) => console.log("database running well"));
    this.app.use(express.urlencoded({ limit: "200mb", extended: true }));
    this.app.use(express.json({ limit: "200mb" }));
    this.app.use(cors());
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      // req.log = logging.writeLog;
      req.db = database();
      next();
    });
  }

  protected routes(): void {
    const route = this.app;
    route.use("/api/v1", Route);
    route.get('/', (req: Request, res: Response) => res.send("Server running"))
    route.get("*", (req: Request, res: Response) => {
      res.status(404).send("not found");
    });
    route.post("*", (req: Request, res: Response) => {
      res.status(404).send("not found");
    });
  }
}

const port: number = 2000;
const app = new App().app;

app.listen(port, () => console.log(`running on ${port}`));
