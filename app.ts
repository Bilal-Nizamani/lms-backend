import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
require("dotenv").config();
app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true }));

//cookie parser
app.use(cookieParser());

// cors => cross origin resource sharing
app.use(cors({ origin: process.env.ORIGIN }));

// register
app.use("/api/v1", userRouter);

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, message: 'Yeah it"s working fine' });
});
// unknown route

app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});
app.use(ErrorMiddleware);
