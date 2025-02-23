import axios from "axios";
import API_URL from "../config/apiConfig"; 

const apiUrl = `${API_URL}/user/password`;
export const forgotPasword = async (email: string) => {
  console.log("my email: :", email);
  try {
    const response = await axios.post(
      `${apiUrl}/get-mail`,
      { email },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
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
        message: response?.data?.message || "An error occurred",
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

export const resetPasswort = async (token: string | undefined, newPassword: string) => {
  console.log("my token: :", token);
  try {
    const response = await axios.post(
      `${apiUrl}/reset-password/${token}`,
      { newPassword },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
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
        message: response?.data?.message || "An error occurred",
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
