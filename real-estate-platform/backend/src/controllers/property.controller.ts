import { Request, Response, NextFunction } from "express";
import { Op, Order } from "sequelize";
import { Property, User } from "../models/index";
import { ApiError } from "../utils/apiError";
import {
	createPropertySchema,
	updatePropertySchema,
	propertyQuerySchema,
} from "../validators/property.validator";

// POST /api/properties
export async function createProperty(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		const data = createPropertySchema.parse(req.body);
		const userId = req.user!.userId; // Always from JWT, never from request body

		const property = await Property.create({ ...data, userId });

		res.status(201).json({
			success: true,
			message: "Property created successfully",
			data: property,
		});
	} catch (err) {
		next(err);
	}
}

export async function getProperties(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		const query = propertyQuerySchema.parse(req.query);
		const { city, location, minPrice, maxPrice, propertyType, bedrooms, sort, page, limit } = query;

		const where: Record<string, unknown> = {};

		if (city) {
			where["city"] = { [Op.iLike]: `%${city}%` };
		}
		if (location) {
			where["location"] = { [Op.iLike]: `%${location}%` };
		}
		if (propertyType) {
			where["propertyType"] = propertyType;
		}
		if (bedrooms !== undefined) {
			where["bedrooms"] = bedrooms;
		}
		if (minPrice !== undefined || maxPrice !== undefined) {
			where["price"] = {
				...(minPrice !== undefined && { [Op.gte]: minPrice }),
				...(maxPrice !== undefined && { [Op.lte]: maxPrice }),
			};
		}

		// Map sort parameter to Sequelize ORDER clause
		const sortMap: Record<string, Order> = {
			price_asc: [["price", "ASC"]],
			price_desc: [["price", "DESC"]],
			newest: [["createdAt", "DESC"]],
			oldest: [["createdAt", "ASC"]],
		};
		const order: Order = sortMap[sort] ?? [["createdAt", "DESC"]];

		const offset = (page - 1) * limit;

		const { count, rows } = await Property.findAndCountAll({
			where,
			order,
			limit,
			offset,
			attributes: [
				"id", "title", "price", "city", "location",
				"propertyType", "bedrooms", "bathrooms", "area", "images", "createdAt",
			],
			include: [
				{
					model: User,
					as: "owner",
					attributes: ["id", "name"],
				},
			],
		});

		res.json({
			success: true,
			data: {
				properties: rows,
				total: count,
				page,
				totalPages: Math.ceil(count / limit),
			},
		});
	} catch (err) {
		next(err);
	}
}

// GET /api/properties/:id
export async function getPropertyById(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		const id = Number(req.params["id"]);

		const property = await Property.findByPk(id, {
			include: [
				{
					model: User,
					as: "owner",
					attributes: ["id", "name", "email"], // show email for contact; never password
				},
			],
		});

		if (!property) {
			throw new ApiError(404, "Property not found");
		}

		// Find similar properties using a simple algorithm:
		// 1. Same city (primary filter — uses city index)
		// 2. Same property type
		// 3. Bedrooms within ±1 of the current property
		// 4. Price within ±20% of the current property
		const priceVariance = Number(property.price) * 0.2;
		const similarProperties = await Property.findAll({
			where: {
				id: { [Op.ne]: property.id },
				city: property.city,
				propertyType: property.propertyType,
				bedrooms: {
					[Op.between]: [
						Math.max(0, property.bedrooms - 1),
						property.bedrooms + 1,
					],
				},
				price: {
					[Op.between]: [
						Number(property.price) - priceVariance,
						Number(property.price) + priceVariance,
					],
				},
			},
			limit: 6,
			attributes: [
				"id", "title", "price", "city", "location",
				"propertyType", "bedrooms", "bathrooms", "area", "images",
			],
			order: [["createdAt", "DESC"]],
		});

		res.json({
			success: true,
			data: { property, similarProperties },
		});
	} catch (err) {
		next(err);
	}
}

// PUT /api/properties/:id
export async function updateProperty(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		const id = Number(req.params["id"]);
		const userId = req.user!.userId;
		const data = updatePropertySchema.parse(req.body);

		const property = await Property.findByPk(id);
		if (!property) {
			throw new ApiError(404, "Property not found");
		}

		// Ownership check — userId comes from JWT, never from the request body
		if (property.userId !== userId) {
			throw new ApiError(403, "You are not authorized to edit this property");
		}

		await property.update(data);

		res.json({
			success: true,
			message: "Property updated successfully",
			data: property,
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
}

// DELETE /api/properties/:id
export async function deleteProperty(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		const id = Number(req.params["id"]);
		const userId = req.user!.userId;

		const property = await Property.findByPk(id);
		if (!property) {
			throw new ApiError(404, "Property not found");
		}

		if (property.userId !== userId) {
			throw new ApiError(403, "You are not authorized to delete this property");
		}

		await property.destroy();

		res.json({
			success: true,
			message: "Property deleted successfully",
		});
	} catch (err) {
		next(err);
	}
}
