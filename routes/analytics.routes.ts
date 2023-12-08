import { Router } from "express";
import { authrizeRoles, isAuthenticated } from "../middleware/auth";
import {
  getUserAnalytics,
  getCoursesAnalytics,
  getOrdersAnalytics,
} from "../controllers/analytics.controller";

const analyticsRouter = Router();

analyticsRouter.get(
  "/get-users-analytics",
  isAuthenticated,
  authrizeRoles("admin"),
  getUserAnalytics
);

analyticsRouter.get(
  "/get-orders-analytics",
  isAuthenticated,
  authrizeRoles("admin"),
  getOrdersAnalytics
);

analyticsRouter.get(
  "/get-courses-analytics",
  isAuthenticated,
  authrizeRoles("admin"),
  getCoursesAnalytics
);

export default analyticsRouter;
