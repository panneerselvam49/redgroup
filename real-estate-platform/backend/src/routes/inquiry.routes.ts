import { Router } from "express";
import { createInquiry, getReceivedInquiries } from "../controllers/inquiry.controller";
import { authenticate } from "../middleware/auth.middleware";
import { inquiryRateLimit } from "../middleware/rateLimit.middleware";

const router = Router();


router.get("/received", authenticate, getReceivedInquiries);
router.post("/", authenticate, inquiryRateLimit, createInquiry);

export default router;

