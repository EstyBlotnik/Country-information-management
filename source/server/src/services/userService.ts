import bcrypt from "bcryptjs";
import User from "../db/models/user";
import AuthorizationRequest from "../db/models/authorizationRequest";
import jwt from "jsonwebtoken";
import { IUser } from "../db/types/user";
import { Types } from "mongoose";

export const bcryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  profilePicture: string,
  userName: string,
  password: string
) => {
  try {
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      profilePicture,
      role: "View",
      userName,
      password,
      JoiningDate: new Date(),
    });
    await newUser.save();
    return newUser;
  } catch (err) {
    throw new Error(err ? err.toString() : "Could not create user");
  }
};

export const createToken = async (user: IUser) => {
  try {
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "6h" }
    );
    return token;
  } catch (err) {
    throw new Error(err ? err.toString() : "Could not create token");
  }
};

export const getUserByUserName = async (userName: string) => {
  try {
    const user = await User.findOne({ userName }).populate(
      "authorizationRequests"
    );
    return user;
  } catch (err) {
    throw new Error(err ? err.toString() : "Could not find user by username");
  }
};

export const matchPassword = async (password: string, userPassword: string) => {
  try {
    return await bcrypt.compare(password, userPassword);
  } catch (err) {
    throw new Error(err ? err.toString() : "Could not match passwords");
  }
};

export const getUserById = async (userId: string | Types.ObjectId) => {
  try {
    const user = await User.findById(userId).populate("authorizationRequests");
    return user;
  } catch (err) {
    throw new Error(err ? err.toString() : "Could not find user by id");
  }
};

export const getUserByOrMailUserNamePassword = async (
  email: string,
  userName: string,
  phoneNumber: string
) => {
  try {
    const user = await User.findOne({
      $or: [{ email }, { userName }, { phoneNumber }],
    });
    return user;
  } catch (err) {
    throw new Error(
      err
        ? err.toString()
        : "Could not find user by mail, username, and password"
    );
  }
};

export const createAuthorizationRequest = async (
  userId: string,
  requestedRole: string
) => {
  try {
    const newRequest = new AuthorizationRequest({
      requestDate: new Date(),
      userId,
      requestedRole,
      status: "Pending",
    });
    await newRequest.save();
    return newRequest;
  } catch (err) {
    throw new Error(
      err ? err.toString() : "Could not create authorization request"
    );
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (err) {
    throw new Error(err ? err.toString() : "Could not find user by email");
  }
};
