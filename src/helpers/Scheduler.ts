import schedule from "node-schedule";

class Scheduler {
  start(date: string, cb: any) {
    const rule = new schedule.RecurrenceRule();
    rule.date = +date.split("-")[2];
    rule.month = +date.split("-")[1] - 1;
    rule.year = +date.split("-")[0];
    rule.minute = 0;
    rule.second = 0;
    rule.hour = 0;

    schedule.scheduleJob(rule, () => cb());
    return true;
  }
  stop(date: string, cb: any) {
    const rule = new schedule.RecurrenceRule();
    rule.date = +date.split("-")[2];
    rule.month = +date.split("-")[1] - 1;
    rule.year = +date.split("-")[0];
    rule.minute = 0;
    rule.second = 0;
    rule.hour = 0;

    schedule.scheduleJob(rule, () => cb()).cancel(false);
    return true;
  }
  reschedule(oldDate: string, date: string, cb: any) {
    const rule = new schedule.RecurrenceRule();
    rule.date = +oldDate.split("-")[2];
    rule.month = +oldDate.split("-")[1] - 1;
    rule.year = +oldDate.split("-")[0];
    rule.minute = 0;
    rule.second = 0;
    rule.hour = 0;
    const newRule = new schedule.RecurrenceRule();
    newRule.date = +date.split("-")[2];
    newRule.month = +date.split("-")[1] - 1;
    newRule.year = +date.split("-")[0];
    newRule.minute = 0;
    newRule.second = 0;
    newRule.hour = 0;

    schedule.scheduleJob(rule, () => cb())?.reschedule(newRule);
    return true;
  }
}

export default new Scheduler();
