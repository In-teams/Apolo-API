import NumberFormat from "./NumberFormat";

class RedeemHelper {
    index(data: any[], point: any[], pointRedeem: any[], validated: any, key1: string, key2: string): any[]{
        const {sort} = validated
        data = data.map((e: any) => {
            const achieve = parseFloat(
              point.find((p: any) => p[key1] === e[key2])
                ?.achieve || 0
            );
            const redeem = parseFloat(
              pointRedeem.find((p: any) => p[key1] === e[key2])
                ?.redeem || 0
            );
            return {
              ...e,
              achieve: achieve,
              redeem: redeem,
              diff: parseFloat((achieve - redeem).toFixed(2)),
              percentage: parseFloat(((redeem / achieve) * 100).toFixed(2)),
              pencapaian: ((redeem / achieve) * 100).toFixed(2) + "%",
            };
          })
          .sort((a, b) =>
            a.percentage > b.percentage
              ? sort.toUpperCase() === "DESC"
                ? -1
                : 1
              : sort.toUpperCase() === "DESC"
              ? 1
              : -1
          ).slice(0, 5);;

          return NumberFormat(data, false, "achieve", "redeem", "diff")
    }
}

export default new RedeemHelper().index