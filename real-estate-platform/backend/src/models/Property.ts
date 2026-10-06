import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export type PropertyType = "apartment" | "villa" | "house" | "plot";

export interface PropertyAttributes {
	id: number;
	userId: number;
	title: string;
	description: string;
	price: number;
	city: string;
	location: string;
	propertyType: PropertyType;
	bedrooms: number;
	bathrooms: number;
	area: number; // in sq ft
	images: string[]; // array of image URLs stored as JSONB
	createdAt?: Date;
	updatedAt?: Date;
}

export interface PropertyCreationAttributes extends Optional<PropertyAttributes, "id"> { }

export interface PropertyModel extends Model<PropertyAttributes, PropertyCreationAttributes>, PropertyAttributes { }

const Property = sequelize.define<PropertyModel>(
	"Property",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "users", key: "id" },
			onDelete: "CASCADE",
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		price: {
			type: DataTypes.BIGINT, // supports prices up to ~9 quadrillion
			allowNull: false,
		},
		city: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		location: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		propertyType: {
			type: DataTypes.ENUM("apartment", "villa", "house", "plot"),
			allowNull: false,
		},
		bedrooms: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		bathrooms: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		area: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		images: {
			type: DataTypes.JSONB,
			allowNull: false,
			defaultValue: [],
		},
	},
	{
		tableName: "properties",
		timestamps: true,
		indexes: [
			{ fields: ["city"] },
			{ fields: ["propertyType"] },
			{ fields: ["bedrooms"] },
			{ fields: ["price"] },
			{ fields: ["createdAt"] },
			{ fields: ["userId"] },
			{ fields: ["city", "propertyType", "bedrooms"] },
			{ fields: ["city", "price"] },
		],
	}
);

export default Property;
