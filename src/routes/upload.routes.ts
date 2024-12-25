import uploadFile from "../helper/upload";
import { Router } from "express";

const router = Router();

router.post("/", uploadFile);

export default router;