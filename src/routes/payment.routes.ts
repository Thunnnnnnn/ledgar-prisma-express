import paymentController from "../controller/payment.controller";
import { Router } from "express";
import { paginationMiddleware } from "../middleware/paginationMiddleware";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/",
  authMiddleware.checkAuth,
  paginationMiddleware,
  paymentController.getPayments
);
router.get("/:id", authMiddleware.checkAuth, paymentController.getPayment);
router.post("/", authMiddleware.checkAuth, paymentController.createPayment);
router.put("/:id", authMiddleware.checkAuth, paymentController.updatePayment);
router.delete(
  "/:id",
  authMiddleware.checkAuth,
  paymentController.deletePayment
);

export default router;
