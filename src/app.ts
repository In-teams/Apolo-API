import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import Route from "./routes";
import cluster from "cluster";
import totalCPUs from "os";
import config from './config/app'

const total = totalCPUs.cpus().length;
const port: number = 2000;

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.secure();
    this.routes();
    // this.clustering()
  }

  protected secure(): void {
    // database().connect((err) => console.log("database running well"));
    this.app.use(express.urlencoded({ limit: "200mb", extended: true }));
    this.app.use(express.json({ limit: "200mb" }));
    this.app.use('/file/registration', express.static(config.pathRegistration))
    this.app.use(cors());
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next();
    });
  }

  protected routes(): void {
    const route = this.app;
    route.use("/api/v1", Route);
    route.get("/", (req: Request, res: Response) => res.send("Server running"));
    route.get("*", (req: Request, res: Response) => {
      res.status(404).send("not found");
    });
    route.post("*", (req: Request, res: Response) => {
      res.status(404).send("not found");
    });
  }

  protected clustering() {
    if (cluster.isMaster) {
      console.log(`Number of CPUs is ${total}`);
      console.log(`Master ${process.pid} is running`);

      // Fork workers.
      for (let i = 0; i < total; i++) {
        cluster.fork();
      }

      cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster.fork();
      });
    }else{
      console.log(`Worker ${process.pid} started`);
      this.app.listen(port, () => console.log(`running on ${port}`));
    }
  }
}


new App().app.listen(port, () => console.log(`running on ${port}`));;

// app.listen(port, () => console.log(`running on ${port}`));
