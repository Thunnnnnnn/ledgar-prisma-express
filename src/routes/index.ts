import { Router } from "express";
import userRouter from "./users.routes";
import paymentTypeRouter from "./paymentType.routes";

export default (app: { use: (arg0: string, arg1: Router) => void }) => {
    app.use("/users", userRouter);
    app.use("/payment-types", paymentTypeRouter);
}