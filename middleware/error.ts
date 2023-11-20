import ErrorHandler from "../utils/ErrorHandler";

import { Request, NextFunction, Response } from "express";
const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";
  if (err.name === "CastERror") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "JesonWebTokenError") {
    const message = `Json web token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }
  //jew expire error
  if (err.name === "TokenExpiredError") {
    const message = "Json web token is invalid, try again";
    err = new ErrorHandler(message, 400);
  }
  res.status(err.statusCode).json({
    sucess: false,
    message: err.message,
  });
};
export { ErrorMiddleware };
