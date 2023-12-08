import { Router } from "express";
import { authrizeRoles, isAuthenticated } from "../middleware/auth";
import {
  createLayout,
  editLayout,
  getLayoutByType,
} from "../controllers/layout.controller";

const layoutRouter = Router();

layoutRouter.post(
  "/create-layout",
  isAuthenticated,
  authrizeRoles("admin"),
  createLayout
);
layoutRouter.put(
  "/edit-layout",
  isAuthenticated,
  authrizeRoles("admin"),
  editLayout
);
layoutRouter.get("/get-layout", getLayoutByType);

export default layoutRouter;
