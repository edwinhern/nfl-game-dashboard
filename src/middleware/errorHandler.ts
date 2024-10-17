import { logger } from "@/middleware/logger";
import { ServiceResponse } from "@/models/serviceResponse";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
	}
}

export class ErrorHandler {
	private static instance: ErrorHandler;

	private constructor() {}

	public static getInstance(): ErrorHandler {
		if (!ErrorHandler.instance) {
			ErrorHandler.instance = new ErrorHandler();
		}
		return ErrorHandler.instance;
	}

	public handleNotFound = (_req: Request, res: Response) => {
		const errorResponse = ServiceResponse.failure("Resource not found", null, StatusCodes.NOT_FOUND);
		res.status(StatusCodes.NOT_FOUND).json(errorResponse);
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public handleError = (err: Error, _req: Request, res: any, next: NextFunction) => {
		logger.error(`Error: ${err.message}`);

		if (err instanceof AppError) {
			const errorResponse = ServiceResponse.failure(err.message, null, err.statusCode);
			return res.status(err.statusCode).json(errorResponse);
		}

		// For unhandled errors, return a 500 Internal Server Error
		const errorResponse = ServiceResponse.failure(
			"An unexpected error occurred",
			null,
			StatusCodes.INTERNAL_SERVER_ERROR,
		);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
		next(err);
	};
}

export default ErrorHandler.getInstance();
