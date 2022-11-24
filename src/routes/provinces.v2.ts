import IRouter from "../types/RouterInterface";
import {Router} from "express";
import Province from "../controllers/Province";

class ProvincesV2 implements IRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    const controller = Province;

    this.router.get("/", controller.index);
    this.router.get("/:id", controller.show);

    this.router.get("/:id/cities", controller.cities);
    this.router.get("/:id/kabupaten", controller.cities);
    this.router.get("/:id/cities/:cityId", controller.city);
    this.router.get("/:id/kabupaten/:cityId", controller.city);

    this.router.get("/:id/cities/:cityId/districts", controller.districts);
    this.router.get("/:id/kabupaten/:cityId/districts", controller.districts);
    this.router.get("/:id/cities/:cityId/kecamatan", controller.districts);
    this.router.get("/:id/kabupaten/:cityId/kecamatan", controller.districts);

    this.router.get(
      "/:id/cities/:cityId/districts/:districtId",
      controller.district
    );
    this.router.get(
      "/:id/kabupaten/:cityId/districts/:districtId",
      controller.district
    );
    this.router.get(
      "/:id/cities/:cityId/kecamatan/:districtId",
      controller.district
    );
    this.router.get(
      "/:id/kabupaten/:cityId/kecamatan/:districtId",
      controller.district
    );

    this.router.get(
      "/:id/cities/:cityId/districts/:districtId/subdistricts",
      controller.subdistricts
    );
    this.router.get(
      "/:id/kabupaten/:cityId/districts/:districtId/subdistricts",
      controller.subdistricts
    );
    this.router.get(
      "/:id/cities/:cityId/kecamatan/:districtId/subdistricts",
      controller.subdistricts
    );
    this.router.get(
      "/:id/kabupaten/:cityId/kecamatan/:districtId/subdistricts",
      controller.subdistricts
    );

    this.router.get(
      "/:id/cities/:cityId/districts/:districtId/kelurahan",
      controller.subdistricts
    );
    this.router.get(
      "/:id/kabupaten/:cityId/districts/:districtId/kelurahan",
      controller.subdistricts
    );
    this.router.get(
      "/:id/cities/:cityId/kecamatan/:districtId/kelurahan",
      controller.subdistricts
    );
    this.router.get(
      "/:id/kabupaten/:cityId/kecamatan/:districtId/kelurahan",
      controller.subdistricts
    );

    this.router.get(
      "/:id/cities/:cityId/districts/:districtId/subdistricts",
      controller.subdistrict
    );
    this.router.get(
      "/:id/kabupaten/:cityId/districts/:districtId/subdistricts",
      controller.subdistrict
    );
    this.router.get(
      "/:id/cities/:cityId/kecamatan/:districtId/subdistricts",
      controller.subdistrict
    );
    this.router.get(
      "/:id/kabupaten/:cityId/kecamatan/:districtId/subdistricts",
      controller.subdistrict
    );

    this.router.get(
      "/:id/cities/:cityId/districts/:districtId/kelurahan/:subdistrictId",
      controller.subdistrict
    );
    this.router.get(
      "/:id/kabupaten/:cityId/districts/:districtId/kelurahan/:subdistrictId",
      controller.subdistrict
    );
    this.router.get(
      "/:id/cities/:cityId/kecamatan/:districtId/kelurahan/:subdistrictId",
      controller.subdistrict
    );
    this.router.get(
      "/:id/kabupaten/:cityId/kecamatan/:districtId/kelurahan/:subdistrictId",
      controller.subdistrict
    );
  }
}

export default new ProvincesV2().router;
