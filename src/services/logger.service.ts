import winston from "winston";
const formatParams = (info: any) => {
    const {
        timestamp, level, message, ...args
    } = info;
    const ts = timestamp.slice(0, 19).replace('T', ' ');

    return `${ts} ${level}: ${message}`;
};
const format: winston.Logform.Format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(formatParams),
);

export const logger: winston.Logger = winston.createLogger({
    level: "info",
    format,
    transports: [new winston.transports.Console(), new winston.transports.File({filename: "m1.log"})]
})



