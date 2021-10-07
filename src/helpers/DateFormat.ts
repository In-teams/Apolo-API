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
    return moment.utc().format(formatDate)
  }
  getDate(date: any, formatDate: string){
    return moment.utc(date).format(formatDate)
  }
  getNextDate(date: any, coundDay: number, formatDate: string){
    return moment.utc(date).add(coundDay, 'day').format(formatDate)
  }
}

export default new DateFormat();
