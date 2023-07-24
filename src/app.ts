import express from "express";
import {logger} from "./services/logger.service";
import "dotenv/config";
import mongoConnect from "./services/mongodb.service";
import useRoutes from "./routes/api"
import AMQP from "./services/ampq.service";

const app = express();
const AMQPInstance = new AMQP();
const startServer = async () => {
    await AMQPInstance.amqpConnect();
    await mongoConnect();
    app.use(express.json());
    useRoutes(app);

    app.listen(process.env.APP_PORT || 3000, () => {
        logger.info(`Listening app on port ${process.env.APP_PORT || 3000 }`)
    })
}

startServer()
