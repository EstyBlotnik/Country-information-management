import User from "../db/models/user";
import AuthorizationRequest from "../db/models/authorizationRequest";
import { ERRORS_MESSAGES } from "../constants";

export const getAllUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    throw new Error(ERRORS_MESSAGES.ADMIN.FAILD_FETCH_USERS);
  }
};

export const deleteAUserByID = async (id: string) => {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(ERRORS_MESSAGES.ADMIN.FAILD_DELETE_USER);
  }
};

export const getAuthorizationRequestById = async (id: string) => {
  try {
    return await AuthorizationRequest.findById(id);
  } catch (error) {
    throw new Error(ERRORS_MESSAGES.ADMIN.FAILD_FETCH_REQUEST);
  }
};

export const getAllAuthorizationRequest = async () => {
    try {
      return await AuthorizationRequest.find();
    } catch (error) {
      throw new Error(ERRORS_MESSAGES.ADMIN.FAILD_FETCH_REQUESTS);
    }
};
