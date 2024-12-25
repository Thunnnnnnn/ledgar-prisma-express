import { Router } from "express";
import userRouter from "./users.routes";


export default (app: { use: (arg0: string, arg1: Router) => void }) => {
    app.use("/users", userRouter);
}