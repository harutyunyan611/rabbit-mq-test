import express from "express";
import ProductController from "../controllers/product.controller";
const productRouter = express.Router();

const productControllerInstance: ProductController = new ProductController();

productRouter.post("/", productControllerInstance.create);

export default productRouter;