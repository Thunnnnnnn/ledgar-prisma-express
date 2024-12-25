import paymentController from "../controller/payment.controller";
import { Router } from "express";

const router = Router();

router.get("/", paymentController.getPayments);
router.get("/:id", paymentController.getPayment);
router.post("/", paymentController.createPayment);
router.put("/:id", paymentController.updatePayment);
router.delete("/:id", paymentController.deletePayment);

export default router;