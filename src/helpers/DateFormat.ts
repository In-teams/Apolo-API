import moment from "moment";

class DateFormat {
  index(data: [], ...key: string[]): any[] {
    return data.map((row: any) => {
      let res: any | string = {};
      for (let a of key.values()) {
        res[a] = moment(row[a]).format('DD MMMM YYYY')
      }
      return { ...row, ...res };
    });
  }
  getToday(formatDate: string){
    return moment().format(formatDate)
  }
}

export default new DateFormat();
