// import { Request } from "express";
// import Redeem from "../services/Redeem";
// import Registration from "../services/Registration";
// import Sales from "../services/Sales";
// import ArrayOfObjToObj from "./ArrayOfObjToObj";
// import NumberFormat from "./NumberFormat";
// import _ from "lodash";

// class SalesHelper2 {
//   async index(
//     req: Request,
//     data: any[],
//     key: string,
//     key2: any,
//     hirarki: string,
//     hirarkiName: string
//   ) {
//     const { sort } = req.validated;
//     const sumDataBy = (data: any[], key: string) =>
//       _.sumBy(data, (o) => o[key]);
//     let targets: any = await Sales.getTargetByHirarki(req, key);
//     let totalOutlet: number = sumDataBy(targets, "outlet");
//     const totalTarget: number = sumDataBy(targets, "target");
//     targets = ArrayOfObjToObj(targets, key2, "target", "outlet");
//     let aktuals: any = await Sales.getAktualByHirarki(req, key);
//     aktuals = ArrayOfObjToObj(aktuals, key2, "aktual", "outlet");
//     let points: any[] = await Redeem.getPointByHirarki(req, key);
//     points = ArrayOfObjToObj(points, key2, "achieve");
//     let pointRedeems: any[] = await Redeem.getPointRedeemByHirarki(req, key);
//     pointRedeems = ArrayOfObjToObj(pointRedeems, key2, "redeem");
//     let regists: any[] = await Registration.getRegistrationCount(req, key);
//     regists = ArrayOfObjToObj(regists, key2, "registrasi");
//     let result: any[] = data
//       .map((e: any) => {
//         const target = targets[e[key2]]?.target || 0;
//         const outlet = targets[e[key2]]?.outlet || 0;
//         const ao = aktuals[e[key2]]?.outlet || 0;
//         const aktual = +aktuals[e[key2]]?.aktual || 0;
//         const achieve = parseFloat(points[e[key2]]?.achieve || 0);
//         const redeem = parseFloat(pointRedeems[e[key2]]?.redeem || 0);
//         const regist: number = regists[e[key2]]?.registrasi || 0;
//         const notregist: number = outlet - regist;
//         const aoro: string = ((ao / outlet) * 100).toFixed(2) + "%";
//         const percen = ((aktual / target) * 100).toFixed(2);
//         const pencapaian = parseFloat(percen) || 0;
//         return {
//           ...e,
//           [hirarki]: e[hirarkiName],
//           target,
//           aktual,
//           achieve,
//           redeem,
//           regist,
//           notregist,
//           regist_progress: ((regist / outlet) * 100).toFixed(2) + "%",
//           ao,
//           aoro,
//           diff_point: achieve - redeem,
//           outlet,
//           diff: aktual - target,
//           pencapaian: pencapaian,
//           percentage: percen + "%",
//           kontribusi: ((aktual / totalTarget) * 100).toFixed(2) + "%",
//           bobot_target: ((target / totalTarget) * 100).toFixed(2) + "%",
//           bobot_outlet: ((outlet / totalOutlet) * 100).toFixed(2) + "%",
//         };
//       })
//       .sort((a: any, b: any) => {
//         return sort.toUpperCase() === "DESC"
//           ? b.pencapaian - a.pencapaian
//           : a.pencapaian - b.pencapaian;
//       })
//       .slice(0, 5);
//     const sumData = (data: any[], key: string) =>
//       _.reduce(data, (prev: any, curr: any) => prev + curr[key], 0);
//     result = [
//       ...result,
//       {
//         [hirarki]: "Total Pencapaian",
//         target: sumData(result, "target"),
//         achieve: sumData(result, "achieve"),
//         aktual: sumData(result, "aktual"),
//         ao: sumData(result, "ao"),
//         outlet: sumData(result, "outlet"),
//         aoro: ((sumData(result, "ao")/sumData(result, "outlet"))* 100).toFixed(2) + '%',
//         redeem: sumData(result, "redeem"),
//         diff: sumData(result, "diff"),
//         diff_point: sumData(result, "diff_point"),
//         pencapaian: ((sumData(result, "aktual")/sumData(result, "target") * 100)).toFixed(2),
//         percentage:
//           (
//             (sumData(result, "aktual") / sumData(result, "target")) *
//             100
//           ).toFixed(2) + "%",
//         kontribusi:
//           ((sumData(result, "aktual") / totalTarget) * 100).toFixed(2) + "%",
//         bobot_target:
//           ((sumData(result, "target") / totalTarget) * 100).toFixed(2) + "%",
//         bobot_outlet:
//           ((sumData(result, "outlet") / totalOutlet) * 100).toFixed(2) + "%",
//       },
//     ];
//     result = NumberFormat(result, true, "aktual", "target", "diff");
//     result = NumberFormat(result, false, "achieve", "redeem", "diff_point");

//     return result;
//   }
// }

// export default new SalesHelper2().index;

import {Request} from "express";
import Redeem from "../services/Redeem";
import Registration from "../services/Registration";
import Sales from "../services/Sales";
import ArrayOfObjToObj from "./ArrayOfObjToObj";
import NumberFormat from "./NumberFormat";
import _ from "lodash";

const sumData = (
  result: any[],
  hirarki: string,
  totalTarget: any,
  totalOutlet: any
) => {
  const sumData = (data: any[], key: string) =>
    _.reduce(data, (prev: any, curr: any) => prev + curr[key], 0);
  result = [
    ...result,
    {
      [hirarki]: "Total Pencapaian",
      target: sumData(result, "target"),
      achieve: sumData(result, "achieve"),
      aktual: sumData(result, "aktual"),
      ao: sumData(result, "ao"),
      outlet: sumData(result, "outlet"),
      aoro:
        ((sumData(result, "ao") / sumData(result, "outlet")) * 100).toFixed(2) +
        "%",
      redeem: sumData(result, "redeem"),
      diff: sumData(result, "diff"),
      diff_point: sumData(result, "diff_point"),
      pencapaian: (
        (sumData(result, "aktual") / sumData(result, "target")) *
        100
      ).toFixed(2),
      percentage:
        ((sumData(result, "aktual") / sumData(result, "target")) * 100).toFixed(
          2
        ) + "%",
      kontribusi:
        ((sumData(result, "aktual") / totalTarget) * 100).toFixed(2) + "%",
      bobot_target:
        ((sumData(result, "target") / totalTarget) * 100).toFixed(2) + "%",
      bobot_outlet:
        ((sumData(result, "outlet") / totalOutlet) * 100).toFixed(2) + "%",
    },
  ];
  result = NumberFormat(result, true, "aktual", "target", "diff");
  result = NumberFormat(result, false, "achieve", "redeem", "diff_point");

  return result;
};

class SalesHelper2 {
  async index(
    req: Request,
    data: any[],
    key: string,
    key2: any,
    hirarki: string,
    hirarkiName: string,
    sort?: string
  ) {
    const { outlet_id } = req.validated;
    let registThisPeriode: any = null;
    // let registAllPeriode: any = null;
    if (outlet_id && key === "outlet") {
      registThisPeriode = await Registration.getRegistrationFileThisPeriode(
        req
      );
      // registThisPeriode = registThisPeriode.map((e: any) => ({
      //   status: e.status,
      //   level: e.level,
      //   periode: e.periode,
      // }));
      // registAllPeriode = await Registration.getRegistrationFile(req);
      // registAllPeriode = ArrayOfObjToObj(
      //   registAllPeriode,
      //   "periode_id",
      //   "level",
      //   "status",
      //   "periode"
      // );
      // Object.keys(registAllPeriode).map((key: any, label: any) => {
      //   registAllPeriode[`registNoteP${label + 1}`] = registAllPeriode[key];
      //   delete registAllPeriode[key];
      // });
    }
    const sumDataBy = (data: any[], key: string) =>
      _.sumBy(data, (o) => o[key]);
    let targets: any = await Sales.getTargetByHirarki(req, key);
    const totalOutlet: number = sumDataBy(targets, "outlet");
    const totalTarget: number = sumDataBy(targets, "target");
    targets = ArrayOfObjToObj(targets, key2, "target", "outlet");
    let aktuals: any = await Sales.getAktualByHirarki(req, key);
    aktuals = ArrayOfObjToObj(aktuals, key2, "aktual", "outlet");
    let points: any[] = await Redeem.getPointByHirarki(req, key);
    points = ArrayOfObjToObj(points, key2, "achieve");
    let pointRedeems: any[] = await Redeem.getPointRedeemByHirarki(req, key);
    pointRedeems = ArrayOfObjToObj(pointRedeems, key2, "redeem");
    let regists: any[] = await Registration.getRegistrationCount(req, key);
    regists = ArrayOfObjToObj(regists, key2, "registrasi");
    const isMobile = req.useragent?.isMobile;
    const isChrome = req.useragent?.isChrome;
    const isAndroid = req.useragent?.isAndroid;

    const result: any[] = data.map((e: any) => {
      const target = targets[e[key2]]?.target || 0;
      const outlet = targets[e[key2]]?.outlet || 0;
      const ao = aktuals[e[key2]]?.outlet || 0;
      const aktual = +aktuals[e[key2]]?.aktual || 0;
      const achieve = parseFloat(points[e[key2]]?.achieve || 0);
      const redeem = parseFloat(pointRedeems[e[key2]]?.redeem || 0);
      const regist: number = regists[e[key2]]?.registrasi || 0;
      const notregist: number = outlet - regist;
      const aoro: string = ((ao / outlet) * 100).toFixed(2) + "%";
      const percen = ((aktual / target) * 100).toFixed(2);
      const pencapaian = parseFloat(percen) || 0;
      return {
        ...e,
        ...(outlet_id &&
          key === "outlet" && {
            registStatus:
              registThisPeriode?.status || "Level 1A - Formulir Tidak Ada",
          }),
        [hirarki]: e[hirarkiName],
        target,
        aktual,
        achieve,
        redeem,
        regist,
        notregist,
        regist_progress: ((regist / outlet) * 100).toFixed(2) + "%",
        ao,
        aoro,
        diff_point: achieve - redeem,
        outlet,
        diff: aktual - target,
        pencapaian: pencapaian,
        percentage: percen + "%",
        kontribusi: ((aktual / totalTarget) * 100).toFixed(2) + "%",
        bobot_target: ((target / totalTarget) * 100).toFixed(2) + "%",
        bobot_outlet: ((outlet / totalOutlet) * 100).toFixed(2) + "%",
      };
    });
    // .sort((a: any, b: any) => {
    //   return sort?.toUpperCase() === "DESC"
    //     ? b.pencapaian - a.pencapaian
    //     : a.pencapaian - b.pencapaian;
    // })
    // .slice(0, 5);

    const show = req.validated.show || 10;
    const page = req.validated.page || 1;
    const totalPage = Math.ceil(result.length / show);

    let asc = result
      .sort((a: any, b: any) => {
        return a.pencapaian - b.pencapaian;
      })
      .slice((page - 1) * show, page * show);
    let desc = result
      .sort((a: any, b: any) => {
        return b.pencapaian - a.pencapaian;
      })
      .slice((page - 1) * show, page * show);

    // asc = asc.slice((page - 1) * show, page * show);
    // desc = desc.slice((page - 1) * show, page * show);

    asc = sumData(asc, hirarki, totalTarget, totalOutlet);
    desc = sumData(desc, hirarki, totalTarget, totalOutlet);
    return { totalPage, asc, desc };
  }
}

export default new SalesHelper2().index;
