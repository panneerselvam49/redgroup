import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/index";
import { signToken } from "../utils/jwt";
import { ApiError } from "../utils/apiError";
import { registerSchema, loginSchema } from "../validators/auth.validator";

// POST /api/auth/register
export async function register(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		const { name, email, password } = registerSchema.parse(req.body);

		const existing = await User.findOne({ where: { email } });
		if (existing) {
			throw new ApiError(409, "An account with this email already exists");
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const user = await User.create({ name, email, password: hashedPassword });
		const token = signToken(user.id);

		res.status(201).json({
			success: true,
			message: "Account created successfully",
			data: { token, user: user.toSafeJSON() },
		});
	} catch (err) {
		next(err);
	}
}

// POST /api/auth/login
export async function login(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		const { email, password } = loginSchema.parse(req.body);

		const user = await User.findOne({ where: { email } });

		if (!user) {
			throw new ApiError(401, "Invalid email or password");
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new ApiError(401, "Invalid email or password");
		}

		const token = signToken(user.id);

		res.json({
			success: true,
			message: "Logged in successfully",
			data: { token, user: user.toSafeJSON() },
		});
	} catch (err) {
		next(err);
	}
}
