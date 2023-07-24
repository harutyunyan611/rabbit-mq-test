import Validator from "validatorjs"
import OrderService from "../services/order.service";

export default class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
        this.create = this.create.bind(this);
    }

    public async create(req: any, res: any, next: any) {
        const rules = {
            items: "required",
            email: "required|email",
            phoneNumber: "required|string|size:11"
        }
        const validation = new Validator(req.body, rules);
        if (validation.passes()) {
            const result = await this.orderService.create(req.body);
            res.send(result);
        } else {
            res.send(validation.errors);
        }
    }
}
