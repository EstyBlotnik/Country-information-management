import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userData } from "../types/userTypes";
import { toast } from "react-toastify";
import {
  register,
  login,
  editUser,
  getUser,
  changeRoleReqest,
} from "../services/userService";
import { useNavigate } from "react-router-dom";
import { RequestData } from "../types/authorizationRequest";
export const useUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<userData | null, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      const cachedUser = queryClient.getQueryData<userData>(["user"]);
      if (cachedUser) {
        console.log("cachedUser", cachedUser);
        return cachedUser;
      }

      const userId = localStorage.getItem("userId");
      console.log("User ID from localStorage:", userId);

      if (!userId) {
        return null;
      }

      try {
        const response = await getUser(userId);
        if (response.data) {
          return response.data as userData;
        }
        return null;
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    },
    enabled: true,
    staleTime: 1000 * 60 * 15,
  });
  // Register a new user
  const registerMutation = useMutation<userData, Error, userData>({
    mutationFn: async (newUser) => {
      console.log("new user: ", newUser);
      const response = await register(newUser);
      if (response && "data" in response) {
        console.log("user: ", response.data.newUser);
        return response.data.newUser as userData;
      } else {
        throw new Error(response.message);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData<userData>(["user"], data);

      if (data && data._id) {
        localStorage.setItem("userId", data._id);
        queryClient.setQueryData(["user"], data);
      }

      toast.success("User registered successfully");
      console.log("Cache updated after user registration");
      navigate("/home");
    },
    onError: (error) => {
      console.error("Error registering user:", error);
      toast.error(error.message);
    },
  });

  // Login user
  const loginMutation = useMutation<
    userData,
    Error,
    { userName: string; password: string }
  >({
    mutationFn: async ({ userName, password }) => {
      console.log("loginMutation");
      const response = await login({ userName, password });
      console.log("respon: ", response);
      if (response && "data" in response) {
        return response.data.user as userData;
      } else {
        throw new Error(response.message);
      }
    },
    onSuccess: (data) => {
      // Update cache after login
      queryClient.setQueryData<userData>(["user"], data);

      if (data && data._id) {
        localStorage.setItem("userId", data._id);
      }

      toast.success("User logged in successfully");
      console.log("Cache updated after user login");
      navigate("/home");
    },
    onError: (error) => {
      console.error("Error logging in user:", error);
      toast.error(`Error logging in the user: ${error.message}`);
    },
  });

  // Logout user
  const logoutMutation = useMutation<void, Error>({
    mutationFn: async () => {
      return Promise.resolve();
    },
    onSuccess: () => {
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("userId");
      ["user", "users", "permissionRequests"].forEach((key) =>
        queryClient.removeQueries({ queryKey: [key] })
      );
      toast.success("User logged out successfully");
      console.log("Cache cleared after user logout");
      navigate("/");
    },
    onError: (error) => {
      console.error("Error logging out user:", error);
      toast.error(`Error logging out the user: ${error.message}`);
    },
  });

  // Update user information
  const updateUserMutation = useMutation<
    userData,
    Error,
    { userId: string; updatedData: userData }
  >({
    mutationFn: async ({ userId, updatedData }) => {
      console.log("updateMutation: ", updatedData);
      const response = await editUser(userId, updatedData);
      console.log("respon: ", response);
      if (response && "data" in response) {
        return response.data as userData;
      } else {
        throw new Error(response.message);
      }
    },
    onSuccess: (updatedUser) => {
      console.log("Updated user from server:", updatedUser);
      console.log("data:", updatedUser);
      console.log("Updated user from server:", updatedUser);
      queryClient.setQueryData<userData>(["user"], (oldData) => ({
        ...oldData,
        ...updatedUser,
      }));
      navigate("/profile");
      toast.success("User updated successfully");
      console.log("Cache updated after user update");
    },
    onError: (error) => {
      toast.error(`Error updating the user: ${error.message}`);
      console.error("Error updating user:", error);
    },
  });

  const changeRoleReqestMutation = useMutation<RequestData, Error, string>({
    mutationFn: async (role) => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User not logged in");
      }
      console.log("role: ", role);
      const response = await changeRoleReqest(userId, role);
      if (response && "data" in response) {
        return response.data as RequestData;
      } else {
        throw new Error(response.message);
      }
    },
    onSuccess: (data) => {
      console.log("Updated user from server:", data);
      console.log(data);
      queryClient.setQueryData<userData>(["user"], (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            authorizationRequests: [...oldData.authorizationRequests, data],
          };
        }
      });

      toast.success("User reqest updated successfully");
      console.log("Cache updated after user role update");
    },
    onError: (error) => {
      toast.error(`Error adding request: ${error.message}`);
      console.error("Error updating user:", error);
    },
  });
  return {
    user,
    isLoading,
    error,
    registerUser: registerMutation.mutate,
    loginUser: loginMutation.mutate,
    logoutUser: logoutMutation.mutate,
    updateUser: updateUserMutation.mutate,
    changeRoleReqest: changeRoleReqestMutation.mutate,
    changeRoleReqestMutation,
    registerMutation,
    loginMutation,
    logoutMutation,
    updateUserMutation,
  };
};
