import axios from "axios";
import {Request} from "express";
import moment from "moment";
import cron from "node-cron";
import config from "../config/app";
import fs from "./FileSystem";

class Logging {
  protected getTimestampAndIp = async (): Promise<string> => {
    const { data } = await axios.get("https://api.ipify.org/?format=json");
    return moment().format("DD-MM-YYYY H:mm:ss") + " => " + data.ip;
  };

  protected getToday = (): string => {
    return moment().format("DD-MM-YYYY");
  };

  writeLog = async (req: Request, error = false, data: string) => {
    const date = new Date(); // Now
    date.setDate(date.getDate() + config.deleteLogger); // Set now + deleteLogger days as the new date
    let row: string[] = [];
    row.push(
      `${await this.getTimestampAndIp()} [${error ? "ERROR" : "INFO"}] [${
        req.originalUrl
      }] ${data}`
    );
    try {
      const deletedFile = cron.schedule(
        `0 0 ${date.getDate()} ${date.getMonth() + 1} *`,
        async () => {
          await fs.DeleteFile(`${config.pathLogger}/${this.getToday()}.txt`);
        }
      );
      deletedFile.start();
      const get: string[] | undefined = await fs.ReadFile(
        `${config.pathLogger}/${this.getToday()}.txt`
      );
      if (typeof get === "object") {
        row = [...get, ...row];
      }

      await fs.WriteFile(
        `${config.pathLogger}/${this.getToday()}.txt`,
        row.join("\n")
      );
    } catch (error) {
      // if (error.type === "GET_FILE")
      //   return await fs.WriteFile(
      //     `${pathLogger}/${this.getToday()}.txt`,
      //     row.join("\n")
      //   );
      // console.log(error, "<<<<");
    }
  };
}

export default new Logging();
