import cors from "cors";
import dotenv from "dotenv";
import express, { type Application } from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/auth.routes";
import { issuesRouter } from "./modules/issues/issues.routes";

dotenv.config();
const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5000",
  }),
);


app.use("/api/auth", authRouter)
app.use("/api/issues", issuesRouter)


app.get("/", (req, res) => {
  res.send("devPulse!");
});

export default app;
