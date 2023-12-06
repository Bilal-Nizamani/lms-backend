import { Router } from "express";

import { authrizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrders } from "../controllers/order.controller";

const orderRouter = Router();

orderRouter.post("/purchase-course", isAuthenticated, createOrder);
orderRouter.post(
  "/get-orders",
  isAuthenticated,
  authrizeRoles("admin"),
  getAllOrders
);

export default orderRouter;
