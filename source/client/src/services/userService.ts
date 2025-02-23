import axios from "axios";
import { userData, UserResponse, ErrorResponse } from "../types/userTypes";
import API_URL from "../config/apiConfig";
import { RequestData } from "../types/authorizationRequest";

const apiUrl = `${API_URL}/user`;
const apiAdminUrl = `${API_URL}/admin`;
const validPermissions = ["Edit", "Add", "Delete"];

export const register = async (data: userData) => {
  console.log("Adding data:", data);
  try {
    const response = await axios.post(`${apiUrl}/register`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    return {
      success: response.status >= 200 && response.status < 300,
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "An error occurred",
    };
  }
};

export const login = async ({
  userName,
  password,
}: {
  userName: string;
  password: string;
}) => {
  console.log("Logging in:", { userName, password });
  try {
    const response = await axios.post(
      `${apiUrl}/login`,
      { userName, password },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    console.log(response);
    if (response.status === 200) {
      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } else {
      return {
        success: false,
        status: response.status,
        message: "Invalid credentials",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "An error occurred",
    };
  }
};

export const editUser = async (userId: string, user: userData) => {
  try {
    console.log("id to server:", userId, "data:", user);

    if (user instanceof FormData) {
      for (let pair of user.entries()) {
        console.log(pair[0], pair[1]);
      }
    } else {
      console.log("user is not FormData");
    }

    const response = await axios.put(`${apiUrl}/${userId}`, user, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    if (response.status === 200) {
      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } else {
      console.log(response);
      return {
        success: false,
        status: response.status,
        message: "Invalid credentials",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "An error occurred",
    };
  }
};

export const getUser = async (userId: string) => {
  try {
    const response = await axios.get(`${apiUrl}/${userId}`, {
      withCredentials: true,
    });
    console.log("response: ", response.data.user);
    if (response.status === 200) {
      return {
        success: true,
        status: response.status,
        data: response.data.user,
      };
    } else {
      return {
        success: false,
        status: response.status,
        message: "Invalid credentials",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "An error occurred",
    };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${apiAdminUrl}/users`, {
      withCredentials: true,
    });
    console.log("response: ", response.data.users);
    if (response.status === 200) {
      return {
        success: true,
        status: response.status,
        data: response.data.users,
      };
    } else {
      return {
        success: false,
        status: response.status,
        message: "Invalid credentials",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "An error occurred",
    };
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete(`${apiAdminUrl}/users/${userId}`, {
      withCredentials: true,
    });
    if (response.status === 200 || response.status === 204) {
      return {
        success: true,
        status: response.status,
        data: response.data.newUser,
      };
    } else {
      return {
        success: false,
        status: response.status,
        message: response?.data?.message || "Invalid credentials",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "An error occurred",
    };
  }
};

export const changeRoleReqest = async (userId: string, role: string) => {
  if (!validPermissions.includes(role)) {
    throw new Error("Invalid role");
  }
  console.log("role", role);
  try {
    const response = await axios.put(
      `${apiUrl}/changeRole/${userId}`,
      { newRole: role },
      {
        withCredentials: true,
      }
    );
    console.log("respons from server", response)
    if (response.status === 200) {
      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } else {
      return {
        success: false,
        status: response.status,
        message: response?.data?.message || "Invalid credentials",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "An error occurred",
    };
  }
};

export const addUser = async (userData: userData) => {
  console.log("addUser");
  try {
    const response = await axios.post(`${apiAdminUrl}/addUser`, userData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    console.log("response: ", response.data);
    if (response.status === 200) {
      return {
        success: true,
        status: response.status,
        data: response.data.newUser,
      };
    } else {
      return {
        success: false,
        status: response.status,
        message: response?.data?.message || "Invalid credentials",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "An error occurred",
    };
  }
};

export const fetchPermissionRequestsFromServer = async () => {
  console.log("fetchPermissionRequestsFromServer");
  try {
    const response = await axios.get(`${apiAdminUrl}/allReqests`, {
      withCredentials: true,
    });
    console.log("respons from server:", response.data.reqests);
    return response.data.reqests;
  } catch {
    console.log("something went wrong");
    return [];
  }
};

export const changeRoleResponse = async (reqId: string, approved: boolean) => {
  console.log("changeRoleResponse");
  try {
    const response = await axios.put(
      `${apiAdminUrl}/changeRoleResponse/${reqId}`,
      { approved },
      {
        withCredentials: true,
      }
    );
    console.log("response: ", response.data);
    if (response.status === 200) {
      const updateReq = response.data.reqest;
      const permissionRequests = JSON.parse(
        localStorage.getItem("permissionRequests") || "[]"
      );
      const updatedPermissionRequests = permissionRequests.map(
        (request: RequestData) =>
          request._id === updateReq._id ? { ...request, ...updateReq } : request
      );
      localStorage.setItem(
        "permissionRequests",
        JSON.stringify(updatedPermissionRequests)
      );
      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } else {
      return {
        success: false,
        status: response.status,
        message: response?.data?.message || "Invalid credentials",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "An error occurred",
    };
  }
};
