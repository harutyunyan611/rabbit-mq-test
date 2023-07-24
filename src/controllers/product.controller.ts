import Validator from "validatorjs"
import ProductService from "../services/product.service";

export default class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService;
        this.create = this.create.bind(this);
    }

    public async create(req: any, res: any, next: any) {
        const rules = {
            name: "required|string",
            price: "required|numeric",
        }
        const validation = new Validator(req.body, rules);
        if (validation.passes()) {
            const result = await this.productService.create(req.body);
            res.send(result);
        } else {
            res.send(validation.errors);
        }
    }
}
