import express from "express";
import OrderController from "../controllers/order.controller";
const orderRouter = express.Router();

const orderControllerInstance: OrderController = new OrderController();

orderRouter.post("/", orderControllerInstance.create);

export default orderRouter