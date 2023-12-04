import { Router } from "express";

import { authrizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder } from "../controllers/order.controller";

const orderRouter = Router();

orderRouter.post("/purchase-course", isAuthenticated, createOrder);

export default orderRouter;
