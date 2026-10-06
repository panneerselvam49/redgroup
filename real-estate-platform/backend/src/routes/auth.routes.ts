import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { authRateLimit } from "../middleware/rateLimit.middleware";

const router = Router();

router.post("/register", authRateLimit, register);
router.post("/login", authRateLimit, login);

export default router;
