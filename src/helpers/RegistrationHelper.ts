class RegistrationHelper {
  index(data: any[], type: string): any[] {
    data = data.map((e: any) => ({
      ...e,
      Level1: e.notregist,
      percentage: e.pencapaian + "%",
      pencapaian: parseFloat(e.pencapaian),
    }));

    const summ = {
      [type]: "Total Pencapaian",
      notregist: data.reduce((prev, curr) => prev + curr.notregist, 0),
      regist: data.reduce((prev, curr) => prev + curr.regist, 0),
      total: data.reduce((prev, curr) => prev + curr.total, 0),
      percentage:
        (
          (data.reduce((prev, curr) => prev + curr.regist, 0) /
            data.reduce((prev, curr) => prev + curr.total, 0)) *
          100
        ).toFixed(2) + "%",
      pencapaian: parseFloat(
        (
          (data.reduce((prev, curr) => prev + curr.regist, 0) /
            data.reduce((prev, curr) => prev + curr.total, 0)) *
          100
        ).toFixed(2)
      ),
      totals: data[0]?.totals,
      bobot_outlet:
        (
          (data.reduce((prev, curr) => prev + curr.total, 0) / data[0]?.totals) *
          100
        ).toFixed(2) + "%",
    };

    data.push(summ);
    return data;
  }
}

export default new RegistrationHelper().index;
