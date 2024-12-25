import usersController from "../controller/users.controller";
import { Router } from "express";
import { paginationMiddleware } from "../middleware/paginationMiddleware";

const router = Router();

router.get("/", paginationMiddleware, usersController.getUsers);
router.get("/:id", usersController.getUser);
router.post("/", usersController.createUser);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

export default router;
