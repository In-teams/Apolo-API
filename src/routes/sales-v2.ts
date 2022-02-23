import {Router} from "express"
import AccessMiddleware from "../helpers/AccessMiddleware";
import {SalesControllerV2} from "../controllers/sales-controller-v2";
import SalesRequest from "../request/Sales";
import IRouter from "../types/RouterInterface";
import SalesController from "../controllers/Sales";

class SalesV2 implements IRouter {
    public router: Router;

    constructor() {
        this.router = Router();

        this.routes();
    }

    routes() {
        const controller = new SalesControllerV2;
        this.router.get("/", SalesRequest.get, SalesController.get); // summary (all)
        this.router.get("/summary/hr", AccessMiddleware.wilayah, SalesRequest.get, controller.getSummaryByHR);
        this.router.get("/summary/region", AccessMiddleware.region, SalesRequest.get, controller.getSummaryByRegion);
        this.router.get("/summary/distributor", AccessMiddleware.wilayah, SalesRequest.get, controller.getSummaryByDistributor);
        this.router.get("/summary/outlet", AccessMiddleware.wilayah, SalesRequest.get, controller.getSummaryByOutlet);
        this.router.get("/summary/area", AccessMiddleware.wilayah, SalesRequest.get, controller.getSummaryByArea);
        this.router.get("/summary/asm", AccessMiddleware.wilayah, SalesRequest.get, controller.getSummaryByASM);
        this.router.get("/summary/ass", AccessMiddleware.wilayah, SalesRequest.get, controller.getSummaryByASS);
        this.router.get("/summary/achieve", AccessMiddleware.wilayah, SalesRequest.get, controller.getSummaryByAchieve);
        this.router.get("/summary/quarter", AccessMiddleware.wilayah, SalesRequest.get, controller.getSummaryPerQuarter);
        this.router.get("/summary/sem", AccessMiddleware.wilayah, SalesRequest.get, controller.getSummaryPerSemester);
        this.router.get("/summary/year", AccessMiddleware.wilayah, SalesRequest.get, controller.getSummaryPerYear);
        this.router.get("/summary/years", AccessMiddleware.wilayah, SalesRequest.get, controller.getSummaryPerYears);
    }
}

export default new SalesV2().router
