import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
	process.env.DB_NAME as string,
	process.env.DB_USER as string,
	process.env.DB_PASSWORD as string,
	{
		dialect: "postgres",
		host: process.env.DB_HOST || "localhost",
		port: Number(process.env.DB_PORT) || 5432,
		logging: true,
		pool: {
			max: 10,
			min: 2,
			acquire: 30000,
			idle: 10000,
		},
	}
);

export default sequelize;
