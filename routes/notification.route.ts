import express from "express";
import { authrizeRoles, isAuthenticated } from "../middleware/auth";
import { getNotifications } from "../controllers/notification.controller";
const notificationRoute = express.Router();

notificationRoute.get(
  "/get-all-notifications",
  isAuthenticated,
  authrizeRoles("admin"),
  getNotifications
);

export default notificationRoute;
