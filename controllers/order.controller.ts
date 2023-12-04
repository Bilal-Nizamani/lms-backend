import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import CourseModel from "../models/course.model";
import userModel from "../models/user.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.Model";
import OrderModel, { IOrder } from "../models/order.Model";
import { newOrder } from "../services/order.service";

export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;
      const user = await userModel.findById(req.user?._id);

      const alreadyPurchased = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );
      if (alreadyPurchased)
        return next(new ErrorHandler("you already bought this course", 400));

      const course = await CourseModel.findById(courseId);
      if (!course) return next(new ErrorHandler("course does not exist", 400));

      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };

      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          Date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );
      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
      }
      user?.courses.push(course?._id);
      await user?.save();
      await NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `You have new order ${course?.name}`,
      });
      if (course.purchased) course.purchased += 1;
      await course.save();

      newOrder(data, res, next);
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);
