import bcrypt from "bcryptjs";
import User from "../db/models/user";
import AuthorizationRequest from "../db/models/authorizationRequest";
import { Types } from "mongoose";
import { ERRORS_MESSAGES } from "../constants";

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
    throw new Error(err ? err.toString() : ERRORS_MESSAGES.USER.CREATE_USER);
  }
};

export const getUserByUserName = async (userName: string) => {
  try {
    const user = await User.findOne({ userName }).populate(
      "authorizationRequests"
    );
    return user;
  } catch (err) {
    throw new Error(
      err ? err.toString() : ERRORS_MESSAGES.USER.FIND_BY_USERNAME
    );
  }
};

export const matchPassword = async (password: string, userPassword: string) => {
  try {
    return await bcrypt.compare(password, userPassword);
  } catch (err) {
    throw new Error(err ? err.toString() : ERRORS_MESSAGES.USER.MATCH_PASSWORD);
  }
};

export const getUserById = async (userId: string | Types.ObjectId) => {
  try {
    const user = await User.findById(userId).populate("authorizationRequests");
    return user;
  } catch (err) {
    throw new Error(err ? err.toString() : ERRORS_MESSAGES.USER.NOT_FOUND);
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
    throw new Error(err ? err.toString() : ERRORS_MESSAGES.USER.NOT_FOUND);
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
    throw new Error(err ? err.toString() : ERRORS_MESSAGES.USER.CREATE_REQUEST);
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (err) {
    throw new Error(err ? err.toString() : ERRORS_MESSAGES.USER.NOT_ADMIN);
  }
};
