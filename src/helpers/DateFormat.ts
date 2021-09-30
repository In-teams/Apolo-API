import moment from "moment";

class DateFormat {
  index(data: any[], format: string, ...key: string[]): any[] {
    return data.map((row: any) => {
      let res: any | string = {};
      for (let a of key.values()) {
        res[a] = row[a] ? moment.utc(row[a]).format(format) : '-'
      }
      return { ...row, ...res };
    });
  }
  getToday(formatDate: string){
    return moment().format(formatDate)
  }
}

export default new DateFormat();
