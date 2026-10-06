import rateLimit from "express-rate-limit";

export const authRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5,
	message: {
		success: false,
		message: "Too many attempts. Please try again after 15 minutes.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// Inquiry rate limit
export const inquiryRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10,
	message: {
		success: false,
		message: "Too many inquiry requests. Please try again after 15 minutes.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// rate limit for all API
export const generalRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 200,
	message: {
		success: false,
		message: "Too many requests. Please slow down.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});
