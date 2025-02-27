import { Request, Response } from "express";
import {
  deleteAUserByID,
  getAllAuthorizationRequest,
  getAllUsers,
  getAuthorizationRequestById,
} from "../services/adminService";
import { verifyToken } from "../middlewares/adminMiddlware";
import {
  bcryptPassword,
  createUser,
  getUserById,
  getUserByOrMailUserNamePassword,
} from "../services/userService";
import { ERRORS_MESSAGES, SUCCESS_MESSAGES } from "../constants";

// Get all users
export const allUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: ERRORS_MESSAGES.SERVER_ERROR });
  }
};

// Delete a user by ID
export const deleteUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: ERRORS_MESSAGES.ACCESS.NO_TOKEN });
      return;
    } else {
      const decoded = verifyToken(token);
      if (decoded.id === id) {
        res.status(403).json({
          message: ERRORS_MESSAGES.ACCESS.FORBIDDEN_ADMIN,
        });
        return;
      }
    }
    const deletedUser = await deleteAUserByID(id);
    if (!deletedUser) {
      res.status(404).json({ message: ERRORS_MESSAGES.USER.NOT_FOUND });
    } else {
      res.status(204).json(deletedUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: ERRORS_MESSAGES.SERVER_ERROR });
  }
};

// Change the role of a user based on authorization request approval
export const changeRoleResponse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    if (!id) {
      res.status(400).json({ message: ERRORS_MESSAGES.REQEST.MISSING_REQUEST });
      return;
    }
    const reqest = await getAuthorizationRequestById(id);
    if (!reqest) {
      res.status(404).json({ message: ERRORS_MESSAGES.REQEST.NOT_FOUND });
      return;
    }
    const user = await getUserById(reqest.userId.toString());
    if (!user) {
      res.status(404).json({ message: ERRORS_MESSAGES.USER.NOT_FOUND });
      return;
    }
    if (approved === "true") {
      user.role = reqest.requestedRole;
      reqest.status = "Approved";
    } else {
      reqest.status = "Denied";
    }
    await user.save();
    reqest.responseDate = new Date();
    await reqest.save();
    res.status(200).json({ user, reqest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: ERRORS_MESSAGES.SERVER_ERROR });
  }
};

// Get all authorization requests
export const allReqs = async (req: Request, res: Response): Promise<void> => {
  try {
    const reqests = await getAllAuthorizationRequest();
    res.status(200).json({ reqests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: ERRORS_MESSAGES.SERVER_ERROR });
  }
};

// Add a new user
export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phoneNumber, userName, password } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !userName ||
      !password
    ) {
      res.status(400).json({ message: ERRORS_MESSAGES.MISSING_DATA });
      return;
    }
    const existingUser = await getUserByOrMailUserNamePassword(
      email,
      userName,
      phoneNumber
    );

    if (existingUser) {
      res.status(400).json({ message: ERRORS_MESSAGES.USER.DUPLICATE_USER });
      return;
    }

    const profilePicture = req.file ? `/uploads/${req.file.filename}` : "";

    const hashedPassword = await bcryptPassword(password);

    const newUser = await createUser(
      firstName,
      lastName,
      email,
      phoneNumber,
      profilePicture,
      userName,
      hashedPassword
    );

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.json({
      message: SUCCESS_MESSAGES.USER.CREATE_SUCCESS,
      newUser: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: ERRORS_MESSAGES.SERVER_ERROR });
  }
};
