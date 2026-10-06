import { Request, Response, NextFunction } from "express";
import { Inquiry, Property, User } from "../models/index";
import { ApiError } from "../utils/apiError";
import { createInquirySchema } from "../validators/inquiry.validator";

// POST /api/inquiries
export async function createInquiry(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		const { propertyId, message } = createInquirySchema.parse(req.body);
		const userId = req.user!.userId; // Always from JWT

		// Fetch the property to get ownerId and verify it exists
		const property = await Property.findByPk(propertyId, {
			attributes: ["id", "userId"],
		});

		if (!property) {
			throw new ApiError(404, "Property not found");
		}

		// Prevent user from contacting themselves
		if (property.userId === userId) {
			throw new ApiError(400, "You cannot send an inquiry to your own property");
		}

		// Application-level duplicate check (gives a nicer error message than DB constraint)
		const existing = await Inquiry.findOne({
			where: { propertyId, userId },
		});
		if (existing) {
			throw new ApiError(409, "You have already sent an inquiry for this property");
		}

		// ownerId is taken from the property record — never trusted from the client
		const inquiry = await Inquiry.create({
			propertyId,
			userId,
			ownerId: property.userId,
			message,
		});

		res.status(201).json({
			success: true,
			message: "Inquiry sent successfully",
			data: inquiry,
		});
	} catch (err) {
		next(err);
	}
}

// GET /api/inquiries/received
export async function getReceivedInquiries(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		const ownerId = req.user!.userId;

		const inquiries = await Inquiry.findAll({
			where: { ownerId },
			include: [
				{
					model: Property,
					as: "property",
					attributes: ["id", "title", "price", "city", "propertyType", "images"],
				},
				{
					model: User,
					as: "sender",
					attributes: ["id", "name", "email"],
				},
			],
			order: [["createdAt", "DESC"]],
		});

		res.json({
			success: true,
			data: inquiries,
		});
	} catch (err) {
		next(err);
	}
}

