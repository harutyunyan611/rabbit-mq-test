import * as mongoose from "mongoose";
import {logger} from "./logger.service";
import {ordersSchema} from "../models/orders.model";
import {productsSchema} from "../models/products.model";
const mongoConnect = async () => {
    const connection = await mongoose.connect(process.env.MONGODB_URI || "localhost");
    switch (connection.connection?.readyState) {
        case 1:
            logger.info(`Mongoose - connection established at ${process.env.MONGODB_URI}`);
            await mongoose.model("Product", productsSchema).createCollection();
            await mongoose.model("Order", ordersSchema).createCollection();
            break;
        case 0:
            logger.error(`Mongoose - disconnected: ${process.env.MONGODB_URI}`);
            break;
        default:
            logger.error(`Mongoose - connection error: ${process.env.MONGODB_URI}`);
    }
}

export default mongoConnect