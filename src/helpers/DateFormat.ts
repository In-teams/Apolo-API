import moment from "moment";

class DateFormat {
  index(data: any[], format: string, ...key: string[]): any[] {
    return data.map((row: any) => {
      const res: any | string = {};
      for (const a of key.values()) {
        res[a] = row[a] ? moment.utc(row[a]).format(format) : "-";
      }
      return { ...row, ...res };
    });
  }
  getToday(formatDate: string) {
    return moment().format(formatDate);
  }
  getDate(date: any, formatDate: string) {
    return moment.utc(date).format(formatDate);
  }
  getNextDate(date: any, coundDay: number, formatDate: string) {
    return moment.utc(date).add(coundDay, "day").format(formatDate);
  }
}

export default new DateFormat();
