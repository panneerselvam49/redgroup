import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export interface InquiryAttributes {
	id: number;
	propertyId: number;
	userId: number;
	ownerId: number;
	message: string;
	createdAt?: Date;
}

export interface InquiryCreationAttributes extends Optional<InquiryAttributes, "id"> { }

export interface InquiryModel extends Model<InquiryAttributes, InquiryCreationAttributes>, InquiryAttributes { }

const Inquiry = sequelize.define<InquiryModel>(
	"Inquiry",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		propertyId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "properties", key: "id" },
			onDelete: "CASCADE",
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "users", key: "id" },
			onDelete: "CASCADE",
		},
		ownerId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "users", key: "id" },
			onDelete: "CASCADE",
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: "inquiries",
		timestamps: true,
		updatedAt: false,
		indexes: [
			{
				unique: true,
				fields: ["propertyId", "userId"],
				name: "unique_inquiry_per_user_property",
			},
			{ fields: ["ownerId"] },
			{ fields: ["propertyId"] },
		],
	}
);

export default Inquiry;
