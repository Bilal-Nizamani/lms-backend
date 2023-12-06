import { Router } from "express";
import { authrizeRoles, isAuthenticated } from "../middleware/auth";
import {
  registrationUser,
  activateUser,
  loginUser,
  logoutUser,
  updateAccessToken,
  getUserInfo,
  socialAuth,
  updateUserInfo,
  updatePassword,
  updateProfilePicture,
  getAllUsers,
  updateUserRole,
} from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticated, logoutUser);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", isAuthenticated, getUserInfo);
userRouter.post("/social-auth", socialAuth);
userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);
userRouter.put("/update-password", isAuthenticated, updatePassword);
userRouter.put(
  "/update-profile-picture",
  isAuthenticated,
  updateProfilePicture
);

userRouter.get(
  "/get-users",
  isAuthenticated,
  authrizeRoles("admin"),
  getAllUsers
);

userRouter.put(
  "/update-user",
  isAuthenticated,
  authrizeRoles("admin"),
  updateUserRole
);
export default userRouter;
