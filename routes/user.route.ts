import { Router } from "express";
import { registrationUser, activateUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
export default userRouter;
