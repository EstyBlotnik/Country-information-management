import PermissionRequests from "../admin/PermissionRequests";

export const UserAllRequests = () => {
  return (
    <div>
      <h1>Permission request history:</h1>
      <PermissionRequests />
    </div>
  );
};
