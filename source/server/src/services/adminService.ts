import User from "../db/models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { assert } from "console";
import AuthorizationRequest from "../db/models/authorizationRequest";

export const getAllUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

export const deleteAUserByID = async (id: string) => {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};

export const getAuthorizationRequestById = async (id: string) => {
  try {
    return await AuthorizationRequest.findById(id);
  } catch (error) {
    throw new Error("Failed to fetch authorization request");
  }
};

export const getAllAuthorizationRequest = async () => {
    try {
      return await AuthorizationRequest.find();
    } catch (error) {
      throw new Error("Failed to fetch authorization requests");
    }
};
