import {Router} from "express";
import {BrandController} from "../controllers/brand.controller";
import {SubBrandController} from "../controllers/sub-brand.controller";
import {CategoryController} from "../controllers/category.controller";

const BrandRouter = Router();
const brandController = new BrandController();
const subBrandController = new SubBrandController();
const categoryController = new CategoryController();

BrandRouter.get("/", (req, res) => brandController.index(req, res));
BrandRouter.get("/sub-brands", (req, res) =>
  subBrandController.index(req, res)
);
BrandRouter.get("/categories", (req, res) =>
  categoryController.index(req, res)
);

export default BrandRouter;
