import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { generateLast12MothsData } from "../services/analytics.generate";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.Model";

// get user analytics --- admin
export const getUserAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MothsData(userModel);
      res.status(200).json({ success: true, users });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// get courses analytics --- admin
export const getCoursesAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await generateLast12MothsData(CourseModel);
      res.status(200).json({ success: true, courses });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// get orders analytics --- admin
export const getOrdersAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await generateLast12MothsData(OrderModel);
      res.status(200).json({ success: true, orders });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);
