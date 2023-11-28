import { Router } from "express";
import {
  editCourse,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
import { authrizeRoles, isAuthenticated } from "../middleware/auth";

const courseRouter = Router();

courseRouter.post(
  "/create-course",
  isAuthenticated,
  authrizeRoles("admin"),
  uploadCourse
);
courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authrizeRoles("admin"),
  editCourse
);
courseRouter.get("/get-course/:id", getSingleCourse);

export default courseRouter;
