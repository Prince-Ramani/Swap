import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import connectMongo from "./connect";
import cookieParser from "cookie-parser";

import authRouter from "./routers/auth";
import projectRouter from "./routers/project";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
const app = express();

const PORT = process.env.PORT || 8000;

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/project", projectRouter);

app.get("*", (req: Request, res: Response) => {
  console.log("No such api found", req.url);
  res.status(404).json({ error: "No such api found!" });
});

app.listen(PORT, () => {
  connectMongo();
  console.log("App listening on PORT : ", PORT);
});
