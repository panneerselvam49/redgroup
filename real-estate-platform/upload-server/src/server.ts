import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const UPLOAD_SERVER_URL = process.env.UPLOAD_SERVER_URL;

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
	fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim());

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	})
);

// ─── Multer disk storage ──────────────────────────────────────────────────────
// Each uploaded file gets a UUID-based name so:
//  1. Filenames are collision-free even under concurrent uploads
//  2. Original filenames (which may contain path traversal characters) are discarded
const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, UPLOADS_DIR);
	},
	filename: (_req, file, cb) => {
		const ext = path.extname(file.originalname).toLowerCase();
		cb(null, `${uuidv4()}${ext}`);
	},
});

// Accept only common image types
const ALLOWED_MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];

const upload = multer({
	storage,
	fileFilter: (_req, file, cb) => {
		if (ALLOWED_MIME.includes(file.mimetype)) {
			cb(null, true);
		} else {
			// Pass an Error — multer v2 will forward it to the error handler
			cb(new Error("Only image files are allowed (jpg, jpeg, png, webp, avif)"));
		}
	},
	limits: {
		fileSize: 10 * 1024 * 1024, // 10 MB per file
		files: 10,                  // max 10 files per request
	},
});

app.use("/uploads", express.static(UPLOADS_DIR));


/**
 * POST /upload
 * Accepts: multipart/form-data with field "images" (one or multiple files)
 * Returns: { success: true, urls: ["http://localhost:5001/uploads/uuid.jpg", ...] }
 */
app.post(
	"/upload",
	upload.array("images", 10),
	(req: Request, res: Response): void => {
		const files = req.files as Express.Multer.File[];

		if (!files || files.length === 0) {
			res.status(400).json({ success: false, message: "No files uploaded" });
			return;
		}

		const urls = files.map(
			(file) => `${UPLOAD_SERVER_URL}/uploads/${file.filename}`
		);

		res.status(201).json({ success: true, urls });
	}
);

/**
 * DELETE /upload/:filename
 * Delete a previously uploaded file by its filename (not full path).
 */
app.delete("/upload/:filename", (req: Request, res: Response): void => {
	const filename = req.params["filename"];

	// Only allow safe filenames — block directory traversal
	if (!/^[\w\-\.]+$/.test(filename)) {
		res.status(400).json({ success: false, message: "Invalid filename" });
		return;
	}

	const filePath = path.join(UPLOADS_DIR, filename);
	if (!fs.existsSync(filePath)) {
		res.status(404).json({ success: false, message: "File not found" });
		return;
	}

	fs.unlinkSync(filePath);
	res.json({ success: true, message: "File deleted" });
});

// Health check
app.get("/health", (_req, res) => {
	res.json({ success: true, message: "Upload server running", uploadsDir: UPLOADS_DIR });
});

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
	if (err instanceof multer.MulterError) {
		res.status(400).json({ success: false, message: err.message });
		return;
	}
	if (err instanceof Error) {
		res.status(400).json({ success: false, message: err.message });
		return;
	}
	res.status(500).json({ success: false, message: "Internal server error" });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
	console.log(`Upload server → ${UPLOAD_SERVER_URL}`);
	console.log(`Files stored at: ${UPLOADS_DIR}`);
	console.log(`Upload:  POST   ${UPLOAD_SERVER_URL}/upload`);
	console.log(`Images:  GET    ${UPLOAD_SERVER_URL}/uploads`);
	console.log(`Delete:  DELETE ${UPLOAD_SERVER_URL}/upload`);
});

export default app;
