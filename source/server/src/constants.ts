export const ERRORS_MESSAGES = {
  SERVER_ERROR: "Internal Server Error",
  UNKNOWN: "An unknown error occurred.",
  MISSING_DATA: "Missing required fields",
  INVALD_NAME: "Invalid name format",
  INVALID_FORMAT: "Invalid data format",
  ACCESS: {
    NO_TOKEN: "Access denied. No token provided",
    UNAUTHORIZED_ADMIN: "Access denied. You are not an admin",
    SELF_DELETE: "Access denied. You can't delete your own account.",
    UNAUTHORIZED_USER:
      "Access denied. You are not authorized to perform this action",
    FORBIDDEN_ADMIN: "Access denied. You can't delete your own account",
    FORBIDDEN_USER: "Access denied. You can't delete this user",
  },
  USER: {
    NOT_FOUND: "User not found",
    UPDATE_ERROR: "Error updating user",
    DELETE_ERROR: "Error deleting user",
    CREATE_ERROR: "Error creating user",
    NOT_ADMIN: "You are not an admin",
    DUPLICATE_USER: "user already exists",
    INVALID_EMAIL: "Invalid email format",
    INVALID_PASSWORD:
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    PASSWORD_MISMATCH: "Passwords do not match",
    NO_PERMISSIONS:
      "You do not have the necessary permissions to perform this action",
  },
  COUNTRY: {
    NOT_FOUND: "Country not found",
    UPDATE_ERROR: "Error updating country",
    DELETE_ERROR: "Error deleting country",
    CREATE_ERROR: "Error creating country",
    NO_PERMISSIONS:
      "You do not have the necessary permissions to perform this action",
    EXIST: "Country already exists",
  },
  CITY: {
    NOT_FOUND: "City not found",
    UPDATE_ERROR: "Error updating city",
    DELETE_ERROR: "Error deleting city",
    CREATE_ERROR: "Error creating city",
    NO_PERMISSIONS:
      "You do not have the necessary permissions to perform this action",
  },
  GENERAL: {
    NO_PERMISSIONS:
      "You do not have the necessary permissions to perform this action",
  },
  REQEST: {
    NOT_FOUND: "Requested data not found",
    NO_PERMISSIONS:
      "You do not have the necessary permissions to perform this action",
    MISSING_REQUEST: "Missing reqest.",
  },
};

export const ERROR_STATUS_CODES = {
  SERVER_ERROR: 500,
  MISSING_DATA: 400,
  ACCESS: {
    NO_TOKEN: 401,
    UNAUTHORIZED_ADMIN: 403,
    SELF_DELETE: 403,
    UNAUTHORIZED_USER: 403,
    FORBIDDEN_ADMIN: 403,
    FORBIDDEN_USER: 403,
  },
  USER: {
    NOT_FOUND: 404,
    UPDATE_ERROR: 500,
    DELETE_ERROR: 500,
    CREATE_ERROR: 500,
    NOT_ADMIN: 403,
    DUPLICATE_USER: 400,
    INVALID_EMAIL: 400,
    INVALID_PASSWORD: 400,
    PASSWORD_MISMATCH: 400,
    NO_PERMISSIONS: 403,
  },
  COUNTRY: {
    NOT_FOUND: 404,
    UPDATE_ERROR: 500,
    DELETE_ERROR: 500,
    CREATE_ERROR: 500,
    NO_PERMISSIONS: 403,
  },
  CITY: {
    NOT_FOUND: 404,
    UPDATE_ERROR: 500,
    DELETE_ERROR: 500,
    CREATE_ERROR: 500,
    NO_PERMISSIONS: 403,
  },
  GENERAL: {
    NO_PERMISSIONS: 403,
  },
  REQUEST: {
    NOT_FOUND: 404,
    NO_PERMISSIONS: 403,
    MISSING_REQUEST: 400,
  },
};

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const SUCCESS_MESSAGES = {
  USER: {
    CREATE_SUCCESS: "User created successfully",
    UPDATE_SUCCESS: "User updated successfully",
    DELETE_SUCCESS: "User deleted successfully",
    NOT_ADMIN_DELETE: "You can't delete your own account",
    NOT_ADMIN_UPDATE: "You can't update your own account",
    NOT_ADMIN_READ: "You can't read other users' data",
  },
  SUCCESS: "Operation Successful",
  CREATED: "Data created successfully",
  NO_CONTENT: "No data to return",
  BAD_REQUEST: "Invalid request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Access denied",
  NOT_FOUND: "Data not found",
  CONFLICT: "Data conflict",
};
