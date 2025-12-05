import User from "../Models/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

export const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const getUserByEmailWithPassword = async (email) => {
  return await User.findOne({ email }).select("+password");
};

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ status: "success", results: users.length, users });
});

