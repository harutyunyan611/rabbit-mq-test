import mongoose from "mongoose"
import {productsSchema} from "../models/products.model";
import {logger} from "./logger.service";

export default class ProductService {

    private productModel: mongoose.Model<any>
    constructor() {
        this.productModel = mongoose.model("Product", productsSchema);
    }

    public async create(payload: any) {
        logger.info("Creating product");
        const product = new this.productModel({
            name: payload.name,
            price: payload.price,
        })
        product.save();
        logger.info(`Product created, productId: ${product._id}`);
        return {
            message: "Created",
            statusCode: "201"
        }
    }
}