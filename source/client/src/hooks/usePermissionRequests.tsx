import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  fetchPermissionRequestsFromServer,
  changeRoleResponse,
} from "../services/userService";
import { RequestData } from "../types/authorizationRequest";

export const usePermissionRequests = () => {
  const queryClient = useQueryClient();

  // Fetch reqests
  const {
    data: permissionRequests,
    isLoading,
    error,
  } = useQuery<RequestData[], Error>({
    queryKey: ["permissionRequests"],
    queryFn: async () => {
      console.log("permissionRequests query");
      const response = await fetchPermissionRequestsFromServer();
      console.log("response at query: ", response);
      return response;
    },
  });

  const replyPermissionRequestMutation = useMutation<
    RequestData,
    Error,
    { reqId: string; approved: boolean }
  >({
    mutationFn: async ({ reqId, approved }) => {
      const response = await changeRoleResponse(reqId, approved);
      if (response && "data" in response) {
        console.log("not error: ",response.data);
        return response.data as RequestData;
      } else {
        console.log("error");
        throw new Error(response.message);
      }
    },
    onSuccess: (data, { reqId, approved }) => {
      // Update cache after update

      console.log("onSuccess: ", reqId, approved);
      queryClient.setQueryData<RequestData[]>(
        ["permissionRequests"],
        (oldData) =>
          oldData?.map((permissionRequest) =>
            permissionRequest?._id === reqId
              ? {
                  ...permissionRequest,
                  status: approved ? "Approved" : "Denied",
                }
              : permissionRequest
          ) || []
      );
      toast.success("Country updated successfully");
      console.log("Cache updated after country update");
    },
    onError: (error) => {
      toast.error(`Error updating the country: ${error.message}`);
      console.error("Error deleting country:", error);
    },
  });

  return {
    permissionRequests,
    isLoading,
    error,
    reaplyPermissionRequest: replyPermissionRequestMutation.mutate,
    replyPermissionRequestMutation,
  };
};
