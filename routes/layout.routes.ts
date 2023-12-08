import { Router } from "express";
import { authrizeRoles, isAuthenticated } from "../middleware/auth";
import { createLayout } from "../controllers/layout.controller";

const layoutRouter = Router();

layoutRouter.post(
  "/change-layout",
  isAuthenticated,
  authrizeRoles("admin"),
  createLayout
);

export default layoutRouter;
