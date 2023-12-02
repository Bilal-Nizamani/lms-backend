import { Router } from "express";
import {
  editCourse,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
  addAnswer,
  addQuestionData,
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
courseRouter.get("/get-courses", getAllCourses);
courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser);
courseRouter.put("/add-question", isAuthenticated, addQuestionData);
courseRouter.put("/add-answer", isAuthenticated, addAnswer);

export default courseRouter;
