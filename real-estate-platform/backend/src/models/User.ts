import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export interface UserAttributes {
	id: number;
	name: string;
	email: string;
	password: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id"> { }

export interface UserModel extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
	toSafeJSON(): Omit<UserAttributes, "password">;
}

const User = sequelize.define<UserModel>(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
	},
	{
		tableName: "users",
		timestamps: true,
		indexes: [{ unique: true, fields: ["email"] }],
	}
);

User.prototype.toSafeJSON = function (): Omit<UserAttributes, "password"> {
	const { password, ...safeUser } = this.toJSON() as UserAttributes;
	return safeUser;
};

export default User;
