import app from "./app";
import sequelize from "./config/db";

const PORT = process.env.PORT || 5000;

async function startServer(): Promise<void> {
	try {
		await sequelize.authenticate();
		console.log("PostgreSQL connected successfully");

		await sequelize.sync({ force: false });
		console.log("Database models synchronized");

		app.listen(PORT, () => {
			console.log(`Server running at http://localhost:${PORT}`);
			console.log(`API docs at    http://localhost:${PORT}/api-docs`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
}

startServer();
