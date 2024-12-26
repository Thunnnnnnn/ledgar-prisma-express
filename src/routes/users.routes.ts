import usersController from "../controller/users.controller";
import { Router } from "express";
import { paginationMiddleware } from "../middleware/paginationMiddleware";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/",
  authMiddleware.checkAuth,
  paginationMiddleware,
  usersController.getUsers
);
router.get("/:id", authMiddleware.checkAuth, usersController.getUser);
router.get(
  "/payment-per-date/:id",
  authMiddleware.checkAuth,
  usersController.sumPaymentPerDate
);
router.get("/export-payment/:id", authMiddleware.checkAuth, usersController.exportPayment);
router.post("/", usersController.createUser);
router.post("/import-payment/:id", authMiddleware.checkAuth, usersController.importPayment);
router.put("/:id", authMiddleware.checkAuth, usersController.updateUser);
router.delete("/:id", authMiddleware.checkAuth, usersController.deleteUser);

export default router;
