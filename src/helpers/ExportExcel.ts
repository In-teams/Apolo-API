import excelJs from "exceljs";
import {Response} from "express";

const camelCase = (str: string) => {
  const result: string[] = [];
  if (str.includes("_")) {
    const splitted = str.toLowerCase().split("_");

    splitted
      .join(" ")
      .split(" ")
      .forEach((e) => {
        result.push(e.substring(0, 1).toUpperCase() + e.substring(1));
      });

    return result.join(" ");
  }
  return str.substring(0, 1).toUpperCase() + str.substring(1);
};
class exportExcel {
  async index(res: Response, columns: any[], rows: any[]): Promise<any> {
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");
    columns = columns.map((e: any) => ({
      header: camelCase(e),
      key: e,
      width: 30,
    }));
    worksheet.columns = columns;
    worksheet.addRows(rows);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "excel.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  }
}

export default new exportExcel().index;
