import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../utils/apiError";

// Extend Express Request so controllers can access req.user safely
declare global {
	namespace Express {
		interface Request {
			user?: { userId: number };
		}
	}
}

export function authenticate(
	req: Request,
	_res: Response,
	next: NextFunction
): void {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return next(new ApiError(401, "No token provided"));
	}

	const token = authHeader.split(" ")[1];

	try {
		const payload = verifyToken(token);
		// Attach userId to request — controllers must use this, never trust body/params
		req.user = { userId: payload.userId };
		next();
	} catch {
		next(new ApiError(401, "Invalid or expired token"));
	}
}
