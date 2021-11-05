import _ from "lodash";
import NumberFormat from "./NumberFormat";

class RedeemHelper {
  index(
    data: any,
    point: any[],
    pointRedeem: any[],
    validated: any,
    key1: string,
    key2: string,
    hirarki?: any,
    hirarkiName?: any
  ): any[] {
    const { sort } = validated;
    const sumDataBy = (data: any[], key: string) =>
      _.sumBy(data, (o) => o[key]);
    data = data
      .map((e: any) => {
        const achieve = parseFloat(
          point.find((p: any) => p[key1] === e[key2])?.achieve || 0
        );
        const redeem = parseFloat(
          pointRedeem.find((p: any) => p[key1] === e[key2])?.redeem || 0
        );
        return {
          ...e,
          achieve: achieve,
          redeem: redeem,
          diff: parseFloat((achieve - redeem).toFixed(2)),
          percentage: parseFloat(((redeem / achieve) * 100).toFixed(2)) || 0,
          pencapaian: ((redeem / achieve) * 100).toFixed(2) + "%",
        };
      })
      .sort((a: any, b: any) => {
        return sort.toUpperCase() === "DESC"
          ? b.percentage - a.percentage
          : a.percentage - b.percentage;
      })
      .slice(0, 5);
    data.push({
      [hirarki]: "Total Poin",
      achieve: sumDataBy(data, "achieve"),
      redeem: sumDataBy(data, "redeem"),
      diff: sumDataBy(data, "diff"),
      percentage:
        parseFloat(
          (
            (sumDataBy(data, "redeem") / sumDataBy(data, "achieve")) *
            100
          ).toFixed(2)
        ) || 0,
      pencapaian:
        (
          (sumDataBy(data, "redeem") / sumDataBy(data, "achieve")) *
          100
        ).toFixed(2) + "%",
    });

    return NumberFormat(data, false, "achieve", "redeem", "diff");
  }
}

export default new RedeemHelper().index;
