import { paymentTypeController } from "../controller/paymentType.controller";
import { Router } from "express";

const router = Router();

router.get("/", paymentTypeController.getPaymentTypes);
router.get("/:id", paymentTypeController.getPaymentType);
router.post("/", paymentTypeController.createPaymentType);
router.put("/:id", paymentTypeController.updatePaymentType);
router.delete("/:id", paymentTypeController.deletePaymentType);

export default router;