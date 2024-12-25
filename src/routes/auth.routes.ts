import authMiddleware from "../middleware/authMiddleware";
import { Router } from "express";

const router = Router();

router.post("/login", authMiddleware.login);
router.post("/logout", authMiddleware.logout);

export default router;
