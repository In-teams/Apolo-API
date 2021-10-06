import { Request } from "express";
import cron from "node-cron"

class Scheduler {
  start(format: string, cb: any) {
    const task = cron.schedule(format, () => {
        cb()
    });
    
    return task.start()
  }
}

export default new Scheduler();
