import uploadFile from "../helper/upload";
import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware.checkAuth, uploadFile);

export default router;
