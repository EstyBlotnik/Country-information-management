export const ERRORS_MESSAGES = {
  SERVER_ERROR: "Internal Server Error.",
  UNKNOWN: "An unknown error occurred.",
  MISSING_DATA: "Missing required fields.",
  INVALD_NAME: "Invalid name format.",
  INVALID_FORMAT: "Invalid data format.",
  EMAIL_REQUIRED: "Email is required.",
  NO_UPDATES_PROVIDED: "No updates provided.",
  LOGIN_LIMIT: "Too many login attempts. Try again in 2 minutes.",
  ACCESS: {
    NO_TOKEN: "Access denied. No token provided.",
    INVALID_TOKEN: "Invalid token.",
    ADMIN_ONLY: "Access denied. Admins only.",
    ADD_ONLY: "Access denied. Add only.",
    EDIT_ONLY: "Access denied. Edit only.",
    DELETE_ONLY: "Access denied. Delete only.",
    SELF_DELETE: "Access denied. You can't delete your own account.",
    FORBIDDEN_ADMIN: "Access denied. You are not an admin.",
  },
  USER: {
    NOT_FOUND: "User not found.",
    INVALID_DATA_LOGIN: "Invalid userName or password.",
    NOT_ADMIN: "You are not an admin.",
    DUPLICATE_USER: "user already exists.",
    INVALID_EMAIL: "Invalid email format.",
    ROLE_EXISTING: "User already has this role.",
    CREATE_USER: "Could not create user",
    FIND_BY_USERNAME: "Could not find user by username",
    MATCH_PASSWORD: "Could not match passwords",
    CREATE_REQUEST: "Could not create authorization request.",
    CREATE_TOKEN: "Could not create token.",
    MIN_LEN: "userName must contain at least 2 characters.",
    MAX_LEN: "userName can contain up to 50 characters.",

  },
  ADMIN: {
    FAILD_FETCH_USERS: "Failed to fetch users.",
    FAILD_DELETE_USER: "Failed to delete user.",
    FAILD_FETCH_REQUEST: "Failed to fetch authorization request.",
    FAILD_FETCH_REQUESTS: "Failed to fetch authorization requests.",
  },
  COUNTRY: {
    NOT_FOUND: "Country not found.",
    EXIST: "Country already exists.",
    FAILD_FETCH_COUNTRIES: "Failed to fetch countries",
    FAILD_FETCH_COUNTRY: "Failed to fetch country",
    ERROR_UPDATE: "Could not update country.",
    ERROR_ADD: "Could not add country.",
    ERROR_CREATE: "Could not create country.",
    ERROR_DELETE: "Could not delete country.",
    MIN_LEN: "Country name must contain at least 2 characters.",
    MAX_LEN: "Country name can contain up to 50 characters.",
  },
  CITY: {
    NOT_FOUND: "City not found.",
    ALREADY_EXISTS: "City already exists.",
    ERROR_ADD: "Could not add new city.",
    ERROR_DELETE: "Could not delete city.",
    ERROR_DELETE_FROM_COUNTRY: "Could not delete city from country.",
    ERROR_UPDATE: "Could not update city.",
  },
  GENERAL: {
    NO_PERMISSIONS:
      "You do not have the necessary permissions to perform this action.",
      MIN_LEN: "Country name must contain at least 2 characters.",
      MAX_LEN: "Country name can contain up to 50 characters.",
      MIN_LEN_REG: "region must contain at least 2 characters.",
      MAX_LEN_REG: "region name can contain up to 50 characters.",
    },
  REQEST: {
    NOT_FOUND: "Requested data not found.",
    MISSING_REQUEST: "Missing reqest.",
  },
  PASSWORD: {
    NOT_FOUND: "Password not found.",
    // RESET_URL: `http://localhost:5173/passwordreset/${resetToken.token}`
    NO_TOKEN: "Token not found or expired.",
    SENDING_EMAIL: "Error sending email",
    CREAT_TOKEN: "Error creating reset token",
    DELETE_TOKEN: "Error deleting reset token",
    FETCH_TOKEN: "Error fetching reset token",
  },
};

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND:404,
  FORBIDDEN: 403,
  CONFLICT: 409,
};

export const SUCCESS_MESSAGES = {
  USER: {
    USER_LOGDIN: "User logdin successfully",
    REGISTERD: "User registered successfully",
    CREATE_SUCCESS: "User created successfully",
    UPDATE_SUCCESS: "User updated successfully",
    DELETE_SUCCESS: "User deleted successfully",
    NOT_ADMIN_DELETE: "You can't delete your own account",
    NOT_ADMIN_UPDATE: "You can't update your own account",
    NOT_ADMIN_READ: "You can't read other users' data",
  },
  RESET_PASSWORD: {
    EMAIL_SENT: "Reset password link sent to email",
    PASSWORT_RESET: "Password reset successful",
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

export const RESET_PASSWORD = {
  RESET_URL: ",",
  EMAIL_TITLE: "RESET PASSWORD",
};
