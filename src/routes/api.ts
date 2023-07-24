import {Express} from "express";
import orderRouter from "./order"
import productRouter from "./product";

const useRoutes = (app: Express) => {
    app.use("/api/orders", orderRouter);
    app.use("/api/products", productRouter)
}

export default useRoutes;