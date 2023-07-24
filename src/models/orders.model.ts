import {Schema} from "mongoose";
import {productsSchema} from "./products.model"
import {OrderStatuses} from "../Enums/orderStatusEnum";
import Order from "../routes/order";

export const ordersSchema = new Schema({
    items: [productsSchema],
    status: {
        type: String,
        enum: OrderStatuses,
        default: OrderStatuses.pending
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})