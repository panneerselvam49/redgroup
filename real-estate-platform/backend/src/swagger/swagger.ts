import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsDoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Real Estate Platform API",
			version: "1.0.0",
			description:
				"REST API for a real estate listing platform. Supports property listings, search/filter, authentication, and inquiries.",
		},
		servers: [
			{
				url: `http://localhost:${process.env.PORT}`,
				description: "Development server",
			},
		],
		components: {
			securitySchemes: {
				// Allows testing authenticated endpoints directly in the Swagger UI
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
			schemas: {
				CreateProperty: {
					type: "object",
					required: [
						"title", "description", "price", "city", "location",
						"propertyType", "bedrooms", "bathrooms", "area",
					],
					properties: {
						title: { type: "string", example: "Modern 2BHK Apartment" },
						description: { type: "string", example: "Spacious apartment with great view" },
						price: { type: "number", example: 5000000 },
						city: { type: "string", example: "Chennai" },
						location: { type: "string", example: "Anna Nagar, Chennai" },
						propertyType: {
							type: "string",
							enum: ["apartment", "villa", "house", "plot"],
						},
						bedrooms: { type: "integer", example: 2 },
						bathrooms: { type: "integer", example: 2 },
						area: { type: "number", example: 1200 },
						images: {
							type: "array",
							items: { type: "string", format: "uri" },
							example: ["https://example.com/image1.jpg"],
						},
					},
				},
			},
		},
	},
	// Scan all route files for @openapi JSDoc comments
	apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsDoc(options);

export function setupSwagger(app: Express): void {
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	// Expose raw spec as JSON for tooling integrations
	app.get("/api-docs.json", (_req, res) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerSpec);
	});
}
