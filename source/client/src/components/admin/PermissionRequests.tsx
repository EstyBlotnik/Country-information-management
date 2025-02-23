import { useEffect, useState } from "react";
import PermissionRequestCard from "./ReqestCard";
import PermissionRequestsHeader from "./PermissionRequestsHeader";
import { usePermissionRequests } from "../../hooks/usePermissionRequests";
import { useUser } from "../../hooks/useUser";
import LoadingPage from "../LoadingPage";

const PermissionRequests = () => {
  const { user } = useUser();
  const { isLoading, permissionRequests, reaplyPermissionRequest } =
    usePermissionRequests();
  const [filterdPermissionRequests, setFilterdPermissionRequests] =
    useState(permissionRequests);
  const [filter, setFilter] = useState<
    "All" | "Approved" | "Denied" | "Pending"
  >("All");

  /* 
  Determines whether the user is an admin who can see all permission requests 
  or a regular user who can only view their own requests. 
  Based on this distinction, the requests are filtered and displayed according to the selected status.
   */
  useEffect(() => {
    if (user) {
      if (user.role === "Admin") {
        if (filter === "All") {
          setFilterdPermissionRequests(permissionRequests);
        } else {
          setFilterdPermissionRequests(
            permissionRequests &&
              permissionRequests.filter((req) => req.status === filter)
          );
        }
      } else {
        const userRequests = [
          ...user.closedRequests,
          ...(user.openRequest ? [user.openRequest] : []),
        ];
        if (filter === "All") {
          setFilterdPermissionRequests(userRequests);
        } else {
          setFilterdPermissionRequests(
            userRequests && userRequests.filter((req) => req.status === filter)
          );
        }
      }
    }
  }, [permissionRequests, filter, user]);

  // Saves requests to local storage
  useEffect(() => {
    localStorage.setItem(
      "permissionRequests",
      JSON.stringify(permissionRequests)
    );
  }, [permissionRequests]);

  // Denies a permission request
  const onDeny = async (reqId: string) => {
    reaplyPermissionRequest({ reqId, approved: false });
    console.log("deny request");
  };

  // Approves a permission request
  const onApprove = async (reqId: string) => {
    reaplyPermissionRequest({ reqId, approved: true });
    console.log("approve request");
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div>
      <PermissionRequestsHeader filter={filter} setFilter={setFilter} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: "16px",
        }}
      >
        {Array.isArray(filterdPermissionRequests) &&
          filterdPermissionRequests.map((request) => (
            <PermissionRequestCard
              key={request._id || request.userId}
              request={request}
              onApprove={onApprove}
              onDeny={onDeny}
            />
          ))}
      </div>
    </div>
  );
};

export default PermissionRequests;
