import * as amqp from "amqplib";
import {logger} from "./logger.service";
import OrderService from "./order.service";
import {OrderStatuses} from "../Enums/orderStatusEnum";

export default class AMQP {
    static orderChannel: any;
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
        this.amqpConnect = this.amqpConnect.bind(this);
    }

    public async amqpConnect() {
        try {
            const mqConnection:amqp.Connection = await amqp.connect(process.env.CLOUDAMQP_URL || "localhost");
            logger.info("AMQP Connected")
            AMQP.orderChannel = await mqConnection.createChannel();
            await AMQP.orderChannel.assertExchange("accepted_orders", 'fanout', {
                durable: false
            });
            await AMQP.orderChannel.assertExchange("delivered_orders", 'fanout', {
                durable: false
            });
            await AMQP.orderChannel.assertQueue("orders.confirmation");
            await AMQP.orderChannel.bindQueue("orders.confirmation", "accepted_orders", '');
            await AMQP.orderChannel.assertQueue("orders.delivered");
            await AMQP.orderChannel.bindQueue("orders.delivered", "delivered_orders", '');
            await AMQP.orderChannel.prefetch(1);

            await AMQP.orderChannel.consume("orders.confirmation", async(order: any) => {
                const orderParsed = JSON.parse(order.content.toString());
                await this.orderService.changeOrderStatus(orderParsed._id, OrderStatuses.accepted);
                logger.info(`Order ${orderParsed._id} accepted`);
                AMQP.orderChannel.ack(order);
            });

            await AMQP.orderChannel.consume("orders.delivered", async(order: any) => {
                const orderParsed = JSON.parse(order.content.toString());
                await this.orderService.changeOrderStatus(orderParsed._id, OrderStatuses.delivered);
                logger.info(`Order ${orderParsed._id} delivered`);
                AMQP.orderChannel.ack(order);
            });
        } catch (err: any) {
            logger.error(err);
        }
    }
}

