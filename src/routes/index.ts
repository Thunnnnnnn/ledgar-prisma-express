import { Router } from "express";
import userRoute from "./users.routes";
import paymentTypeRoute from "./paymentType.routes";
import paymentRoute from "./payment.routes";

export default (app: { use: (arg0: string, arg1: Router) => void }) => {
    app.use("/users", userRoute);
    app.use("/payment-types", paymentTypeRoute);
    app.use("/payments", paymentRoute);
}