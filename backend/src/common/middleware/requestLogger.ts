import type { Request, Response, NextFunction } from "express";
import winston from "winston";

const logger = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	transports: [
		new winston.transports.Console({
			format: winston.format.simple(),
		}),
		new winston.transports.File({ filename: "error.log", level: "error" }),
		new winston.transports.File({ filename: "combined.log" }),
	],
});

export const requestLogger = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const start = Date.now();
	res.on("finish", () => {
		const duration = Date.now() - start;
		logger.info(
			`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
		);
	});
	next();
};

export default logger;
