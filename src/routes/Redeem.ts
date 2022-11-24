import {Router} from "express";
import RedeemController from "../controllers/Redeem";
import AccessMiddleware from "../helpers/AccessMiddleware";
import Upload from "../helpers/Upload";
import RedeemRequest from "../request/Redeem";
import IRouter from "../types/RouterInterface";

class Redeem implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.get("/", RedeemRequest.get, RedeemController.getPointSummary);
    this.router.get("/last", RedeemRequest.get, RedeemController.getLastRedeem);
    this.router.get(
      "/summary/month",
      RedeemRequest.get,
      RedeemController.getPointSummaryByMonth
    );
    this.router.get(
      "/summary/quarter",
      RedeemRequest.get,
      RedeemController.getPointSummaryByQuarter
    );
    this.router.get(
      "/summary/hr",
      AccessMiddleware.wilayah,
      RedeemRequest.get,
      RedeemController.getPointSummaryByHR
    );
    this.router.get(
      "/summary/region",
      AccessMiddleware.region,
      RedeemRequest.get,
      RedeemController.getPointSummaryByRegion
    );
    this.router.get(
      "/summary/area",
      AccessMiddleware.area,
      RedeemRequest.get,
      RedeemController.getPointSummaryByArea
    );
    this.router.get(
      "/summary/distributor",
      AccessMiddleware.distributor,
      RedeemRequest.get,
      RedeemController.getPointSummaryByDistributor
    );
    this.router.get(
      "/summary/outlet",
      RedeemRequest.get,
      RedeemController.getPointSummaryByOutlet
    );
    this.router.get(
      "/summary/asm",
      AccessMiddleware.area,
      RedeemRequest.get,
      RedeemController.getPointSummaryByASM
    );
    this.router.get(
      "/summary/ass",
      AccessMiddleware.distributor,
      RedeemRequest.get,
      RedeemController.getPointSummaryByASS
    );
    this.router.get(
      "/product",
      RedeemRequest.getProduct,
      RedeemController.getProduct
    );
    this.router.get(
      "/outlet-point/:outlet_id",
      RedeemRequest.getRedeemFile,
      RedeemController.getOutletPoin
    );
    this.router.get(
      "/product-category",
      RedeemRequest.getProduct,
      RedeemController.getProductCategory
    );
    this.router.post("/", RedeemRequest.post, RedeemController.post);
    this.router.post("/bulky", Upload("Redeem"), RedeemController.postBulky);
    this.router.get(
      "/file/:outlet_id",
      RedeemRequest.getRedeemFile,
      RedeemController.getRedeemFile
    );
    this.router.get(
      "/redeem-history/:file_id",
      RedeemRequest.getRedeemHistory,
      RedeemController.getRedeemHistory
    );
    this.router.get(
      "/redeem-history/:file_id/:kd_transaksi",
      RedeemRequest.getTransactionDetail,
      RedeemController.getRedeemHistoryDetail
    );
    this.router.get(
      "/history/:file_id",
      RedeemRequest.getHistoryRedeemFile,
      RedeemController.getHistoryRedeemFile
    );
    this.router.get("/status-penukaran", RedeemController.getRedeemStatus);
    this.router.post(
      "/checkout",
      RedeemRequest.checkout,
      RedeemController.checkout
    );
    this.router.post(
      "/otorisasi",
      RedeemRequest.otorisasi,
      RedeemController.otorisasi
    );
    this.router.post(
      "/purchase-request",
      RedeemRequest.purchaseReq,
      RedeemController.purchase
    );
    this.router.post(
      "/validation",
      RedeemRequest.validation,
      RedeemController.validation
    );
  }
}

export default new Redeem().router;
