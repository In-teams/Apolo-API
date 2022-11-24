import _ from "lodash";

class RegistrationHelper {
  index(data: any[], type: string): any[] {
    const sumDataBy = (data: any[], key: string) =>
      _.sumBy(data, (o) => o[key]);
    data = data.map((e: any) => ({
      ...e,
      Level1: e.notregist,
      Level1percent: ((e.notregist / e.total) * 100).toFixed(2) + "%",
      percentage: e.pencapaian + "%",
      pencapaian: parseFloat(e.pencapaian),
    }));

    const summ = {
      [type]: "Total Pencapaian",
      notregist: sumDataBy(data, "notregist"),
      regist: sumDataBy(data, "regist"),
      total: sumDataBy(data, "total"),
      Level1: sumDataBy(data, "Level1"),
      Level2: sumDataBy(data, "Level2"),
      Level3: sumDataBy(data, "Level3"),
      Level4: sumDataBy(data, "Level4"),
      Level1percent:
        ((sumDataBy(data, "Level1") / sumDataBy(data, "total")) * 100).toFixed(
          2
        ) + "%",
      Level2percent:
        ((sumDataBy(data, "Level2") / sumDataBy(data, "total")) * 100).toFixed(
          2
        ) + "%",
      Level3percent:
        ((sumDataBy(data, "Level3") / sumDataBy(data, "total")) * 100).toFixed(
          2
        ) + "%",
      Level4percent:
        ((sumDataBy(data, "Level4") / sumDataBy(data, "total")) * 100).toFixed(
          2
        ) + "%",
      percentage:
        ((sumDataBy(data, "regist") / sumDataBy(data, "total")) * 100).toFixed(
          2
        ) + "%",
      pencapaian: parseFloat(
        ((sumDataBy(data, "regist") / sumDataBy(data, "total")) * 100).toFixed(
          2
        )
      ),
      totals: data[0]?.totals,
      bobot_outlet:
        ((sumDataBy(data, "total") / data[0]?.totals) * 100).toFixed(2) + "%",
    };

    data.push(summ);
    return data;
  }
}

export default new RegistrationHelper().index;
