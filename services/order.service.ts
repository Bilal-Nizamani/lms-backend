import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import OrderModel from "../models/order.Model";
// create new order

export const newOrder = CatchAsyncError(
  async (data: any, res: Response, next: NextFunction) => {
    const order = await OrderModel.create(data);

    res.status(201).json({ success: true, order });
  }
);

// Get All orders
export const getAllOrdersService = async (res: Response) => {
  const users = await OrderModel.find().sort({ createadAt: -1 });
  res.status(201).json({
    success: true,
    users,
  });
};
