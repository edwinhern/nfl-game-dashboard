import type { NextFunction, Request, Response } from "express";
import winston from "winston";
import env from "./env";

const { combine, timestamp, printf, colorize, align } = winston.format;

const logFormat = combine(
	colorize({ all: true }),
	timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS A" }),
	align(),
	printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
);

export const logger = winston.createLogger({
	level: "info",
	format: logFormat,
	transports: [new winston.transports.Console({ level: env.DEBUG_MODE ? "debug" : "info" })],
});

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
	const start = Date.now();

	res.on("finish", () => {
		const duration = Date.now() - start;
		logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
	});

	next();
};
