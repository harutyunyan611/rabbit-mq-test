import mongoose from "mongoose"
import {ordersSchema} from "../models/orders.model";
import {productsSchema} from "../models/products.model";
import {OrderStatuses} from "../Enums/orderStatusEnum";
import AMQP from "./ampq.service";
import {logger} from "./logger.service";

export default class OrderService {

    private orderModel: mongoose.Model<any>
    private productModel: mongoose.Model<any>
    constructor() {
        this.orderModel = mongoose.model("Order", ordersSchema);
        this.productModel = mongoose.model("Product", productsSchema);
    }

    public async create(payload: any) {
        const products: any[] = [];
        await Promise.all(payload.items.map(async (item: any) => {
            await this.productModel.findById(item).then((res: any) => {
                products.push(res)
            });
        }))
        if (products.length === 0) {
            return {
                message: "Please choose products",
                statusCode: 400
            }
        }
        logger.info(`Creating order, email: ${payload.email}`)
        const order = new this.orderModel({
            items: products,
            email: payload.email,
            phoneNumber: payload.phoneNumber
        })
        order.save();
        logger.info(`Order created, email: ${payload.email}, orderId: ${order.id}`)
        await this.publishToExchange(order);
        logger.info(`Publishing order, orderId: ${order.id}`)
        return {
            message: "Created",
            statusCode: "201"
        }
    }

    public async changeOrderStatus(orderId: string, status: OrderStatuses) {
        try {
            logger.info(`Updating order status into ${status}, orderId: ${orderId}`)
            await this.orderModel.findByIdAndUpdate(orderId, { status });
            const order = await this.orderModel.findById(orderId);
            logger.info(`Order status updated into ${status}, orderId: ${orderId}`)
            return order;
        } catch (e: any) {
            logger.error(e);
        }
    }

    public async publishToExchange(order: any) {
        AMQP.orderChannel.publish("orders",'', Buffer.from(JSON.stringify(order)));
        logger.info(`AMQP - order ${order._id} placed`);
    }
}