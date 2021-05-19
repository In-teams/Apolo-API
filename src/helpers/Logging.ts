import axios from "axios";
import moment from "moment";
import cron from "node-cron";
import { deleteLogger, pathLogger } from "../config/app";
import fs from "./FileSystem";

class Logging {
  protected getTimestampAndIp = async (): Promise<string> => {
    const { data } = await axios.get("https://api.ipify.org/?format=json");
    return moment().format("DD-MM-YYYY H:m:s") + " => " + data.ip;
  };

  protected getToday = (): string => {
    return moment().format("DD-MM-YYYY");
  };

  writeLog = async (error: boolean = false, data: string) => {
    let date = new Date(); // Now
    date.setDate(date.getDate() + deleteLogger); // Set now + deleteLogger days as the new date
    let row: string[] = [];
    row.push(
      `${await this.getTimestampAndIp()} [${error ? "ERROR" : "INFO"}] ${data}`
    );
    try {
      const deletedFile = cron.schedule(
        `0 0 ${date.getDate()} ${date.getMonth() + 1} *`,
        async () => {
          await fs.DeleteFile(`${pathLogger}/${this.getToday()}.txt`);
        }
      );
      deletedFile.start();
      const get: string[] | undefined = await fs.ReadFile(
        `${pathLogger}/${this.getToday()}.txt`
      );
      if (typeof get === "object") {
        row = [...get, ...row];
      }

      await fs.WriteFile(
        `${pathLogger}/${this.getToday()}.txt`,
        row.join("\n")
      );
    } catch (error) {
      if (error.type === "GET_FILE")
        return await fs.WriteFile(
          `${pathLogger}/${this.getToday()}.txt`,
          row.join("\n")
        );
      console.log(error, "<<<<");
    }
  };
}

export default new Logging();
