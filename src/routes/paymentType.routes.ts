import { paymentTypeController } from "../controller/paymentType.controller";
import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { paginationMiddleware } from "../middleware/paginationMiddleware";

const router = Router();

router.get(
  "/",
  authMiddleware.checkAuth,
  paginationMiddleware,
  paymentTypeController.getPaymentTypes
);
router.get(
  "/:id",
  authMiddleware.checkAuth,
  paymentTypeController.getPaymentType
);
router.post(
  "/",
  authMiddleware.checkAuth,
  paymentTypeController.createPaymentType
);
router.put(
  "/:id",
  authMiddleware.checkAuth,
  paymentTypeController.updatePaymentType
);
router.delete(
  "/:id",
  authMiddleware.checkAuth,
  paymentTypeController.deletePaymentType
);

export default router;
