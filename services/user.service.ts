import { Response } from "express";
import { redis } from "../utils/redis";
import userModel from "../models/user.model";

// get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);
  if (userJson) {
    const user = JSON.stringify(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};

// Get All Users
export const getAllUsersService = async (res: Response) => {
  const users = await userModel.find().sort({ createadAt: -1 });
  res.status(201).json({
    success: true,
    users,
  });
};

// update user role

export const updateUserRolesService = async (
  res: Response,
  id: string,
  role: string
) => {
  const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });
  res.status(201).json({
    success: true,
    user,
  });
};
