import { Request } from "express";
import Service from "../services/Sales";
import NumberFormat from "./NumberFormat";

class SalesHelper {
  async index(
    req: Request,
    data: any[],
    type: string,
    isSingle: boolean = false
  ) {
    let aktual: number = 0,
      outlets: number = 0,
      poin: number = 0,
      target: number = 0;
    let totalTarget: any = await Service.getTarget(req);
    totalTarget = totalTarget[0].target || 0;
    let totalOutlet: any = await Service.getOutletCount(req);
    totalOutlet = totalOutlet[0].total || 0;
    data.map((e: any) => {
      aktual += +e.aktual;
      target += +e.target;
      outlets += e.outlets;
      poin += +e.poin;
    });
    data = data.map((e: any) => ({
      ...e,
      aktual: +e.aktual,
      diff: (+e.aktual) - e.target,
      poin: e.poin && +e.poin,
      pencapaian: e.pencapaian
        ? e.pencapaian + "%"
        : ((e.aktual / e.target) * 100).toFixed(2) + "%",
      kontribusi: ((+e.aktual / totalTarget) * 100).toFixed(2) + "%",
      bobot_target: ((e.target / totalTarget) * 100).toFixed(2) + "%",
      bobot_outlet: ((e.outlets / totalOutlet) * 100).toFixed(2) + "%",
    }));
    if (isSingle) {
      data = NumberFormat(data, true, "aktual", "target", "diff");
      data = NumberFormat(data, false, "poin");
      return data;
    }
    data = [
      ...data,
      {
        aktual,
        target,
        poin,
        outlets,
        [type]: type !== "Aktual" ? "Total Pencapaian" : "Total",
        pencapaian: ((aktual / target) * 100).toFixed(2) + "%",
        kontribusi: ((aktual / totalTarget) * 100).toFixed(2) + "%",
        bobot_target: ((target / totalTarget) * 100).toFixed(2) + "%",
        bobot_outlet: ((outlets / totalOutlet) * 100).toFixed(2) + "%",
      },
    ];
    data = NumberFormat(data, true, "aktual", "target", "diff");
    data = NumberFormat(data, false, "poin");
    return data;
  }
}

export default new SalesHelper().index;
