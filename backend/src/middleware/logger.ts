import type { NextFunction, Request, Response } from "express";
import winston from "winston";

import env from "@/env";

const { combine, timestamp, printf, colorize, align } = winston.format;

class Logger {
	private static instance: Logger;
	public logger: winston.Logger;

	private constructor() {
		const logFormat = combine(
			colorize({ all: true }),
			timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS A" }),
			align(),
			printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
		);

		this.logger = winston.createLogger({
			level: "info",
			format: logFormat,
			transports: [new winston.transports.Console({ level: env.DEBUG_MODE ? "debug" : "info" })],
		});
	}

	public static getInstance(): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}
		return Logger.instance;
	}

	public requestLogger = (req: Request, res: Response, next: NextFunction) => {
		const start = Date.now();

		res.on("finish", () => {
			const duration = Date.now() - start;
			this.logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
		});

		next();
	};
}

export const logger = Logger.getInstance().logger;
export const requestLogger = Logger.getInstance().requestLogger;
