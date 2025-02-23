import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getAllUsers,
  editUser,
  deleteUser,
  addUser,
} from "../services/userService";
import { userData } from "../types/userTypes";

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Fetch users
  const {
    data: users,
    isLoading,
    error,
  } = useQuery<userData[], Error>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await getAllUsers();
      if (response && "data" in response) {
        return response.data as userData[];
      } else {
        throw new Error(response.message);
      }
    },
  });

  // Delete a user
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (userId) => {
      deleteUser(userId);
    },
    onSuccess: (_, id) => {
      // Update cache after deletion
      queryClient.setQueryData<userData[]>(
        ["users"],
        (oldData) => oldData?.filter((user) => user._id !== id) || []
      );
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });

  // Update a user
  const updateMutation = useMutation<
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
    onSuccess: (updatedUser, { userId, updatedData }) => {
      // Update cache after update
      queryClient.setQueryData<userData[]>(
        ["users"],
        (oldData) =>
          oldData?.map((user) =>
            user._id === userId ? { ...user, ...updatedUser } : user
          ) || []
      );
      toast.success("Users updated successfully");
      console.log("Cache updated after users update");
    },
    onError: (error) => {
      toast.error(`Error updating the user: ${error.message}`);
      console.error("Error deleting user:", error);
    },
  });

  // Add a new user
  const addMutation = useMutation<userData, Error, userData>({
    mutationFn: async (newUser) => {
      const response = await addUser(newUser);
      if (response && "data" in response) {
        return response.data as userData;
      } else {
        throw new Error(response.message);
      }
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData<userData[]>(["users"], (oldData) => [
        ...(oldData || []),
        newUser,
      ]);
      toast.success("User added successfully");
      console.log("Cache updated after adding new user");
    },
    onError: (error) => {
      console.error("Error adding user:", error);
      toast.error(`Error adding the user: ${error.message}`);
    },
  });

  // Get a specific user by its ID from the cache
  const getUserById = (id: string): userData | undefined => {
    return queryClient
      .getQueryData<userData[]>(["users"])
      ?.find((user) => user._id === id);
  };

  return {
    users,
    isLoading,
    error,
    deleteUser: deleteMutation.mutate,
    deleteMutation,
    updateSelectedUser: updateMutation.mutate,
    updateMutation,
    addUser: addMutation.mutate,
    addMutation,
    getUserById,
  };
};
