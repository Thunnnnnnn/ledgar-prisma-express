import express, { Request, Response } from "express";
import routes from "./routes";
import cors from "cors";
import session from "express-session";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.json("Hello, world!");
});
app.use(
  session({
    secret: "your-secret-key", // เปลี่ยนเป็น secret key ที่ปลอดภัย
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // ในกรณีใช้งาน https จะต้องตั้งค่า secure: true
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
routes(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
