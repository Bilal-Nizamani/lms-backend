import { Router } from "express";
import { authrizeRoles, isAuthenticated } from "../middleware/auth";
import {
  registrationUser,
  activateUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", isAuthenticated, authrizeRoles("admin"), logoutUser);

export default userRouter;
