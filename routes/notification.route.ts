import express from "express";
import { authrizeRoles, isAuthenticated } from "../middleware/auth";
import {
  getNotifications,
  updateNotification,
} from "../controllers/notification.controller";
const notificationRoute = express.Router();

notificationRoute.get(
  "/get-all-notifications",
  isAuthenticated,
  authrizeRoles("admin"),
  getNotifications
);
notificationRoute.put(
  "/update-notification/:id",
  isAuthenticated,
  authrizeRoles("admin"),
  updateNotification
);

export default notificationRoute;
