import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { ZodError } from "zod";

export function errorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction
): void {
	if (err instanceof ApiError) {
		res.status(err.statusCode).json({
			success: false,
			message: err.message,
		});
		return;
	}

	// Handle Zod validation errors
	if (err instanceof ZodError) {
		const message = err.errors.map((e) => e.message).join(", ");
		res.status(400).json({
			success: false,
			message,
		});
		return;
	}

	// Handle Sequelize unique constraint errors
	if (
		typeof err === "object" &&
		err !== null &&
		"name" in err &&
		(err as { name: string }).name === "SequelizeUniqueConstraintError"
	) {
		res.status(409).json({
			success: false,
			message: "Duplicate entry — this record already exists.",
		});
		return;
	}

	console.error("Unhandled error:", err);
	res.status(500).json({
		success: false,
		message: "Internal server error",
	});
}
