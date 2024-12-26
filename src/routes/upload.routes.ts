import uploadFile from "../helper/upload";
import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/",  uploadFile);

export default router;
