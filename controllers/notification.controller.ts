import { Request, Response, NextFunction } from "express";
import NotificationModel from "../models/notification.Model";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cron from "node-cron";
// only for admin
export const getNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModel.find().sort({
        creattedAt: -1,
      });
      res.status(201).json({ success: true, notification });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// update notification === only admin

export const updateNotification = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModel.findById(req.params.id);
      if (!notification)
        return next(new ErrorHandler("notification not found", 404));
      else
        notification.status
          ? (notification.status = "read")
          : notification?.status;

      await notification.save();

      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });
      res.status(201).json({ success: true, notifications });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

cron.schedule("0 0 0 * * *", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await NotificationModel.deleteMany({
    satus: "read",
    createdAt: { $lt: thirtyDaysAgo },
  });
  console.log("Deleted Read Notification");
});
