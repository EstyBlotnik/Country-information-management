import * as React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Divider,
  Avatar,
  Box,
} from "@mui/material";
import { RequestData } from "../../types/authorizationRequest";
import { useUsers } from "../../hooks/useUsers";
import API_URL from "../../config/apiConfig";
import { useUser } from "../../hooks/useUser";

interface PermissionRequestProps {
  request: RequestData;
  onApprove: (reqId: string) => void;
  onDeny: (reqId: string) => void;
}

const PermissionRequestCard: React.FC<PermissionRequestProps> = ({
  request,
  onApprove,
  onDeny,
}) => {
  const { requestDate, userId, requestedRole, status } = request;
  const { getUserById } = useUsers();
  const { user } = useUser();
  const reqUser = getUserById(userId);

  return (
    <Card
      sx={{
        maxWidth: 400,
        margin: 2,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#fafafa",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Box sx={{ padding: 2, flex: 1 }}>
        <CardContent sx={{ paddingBottom: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 1 }}>
            Permission Request
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginBottom: 1 }}
          >
            <strong>Request Date:</strong>{" "}
            {new Date(requestDate).toLocaleDateString("he-IL")}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginBottom: 1 }}
          >
            <strong>Requested by:</strong>{" "}
            {reqUser?.firstName + " " + reqUser?.lastName}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginBottom: 1 }}
          >
            <strong>Requested Role:</strong> {requestedRole}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", marginBottom: 1 }}
          >
            <strong>Status:</strong>{" "}
            <span
              style={{
                color:
                  status === "Approved"
                    ? "green"
                    : status === "Denied"
                      ? "red"
                      : "orange",
              }}
            >
              {status}
            </span>
          </Typography>
        </CardContent>
        <Divider />
        {request.status === "Pending" && user && user.role === "Admin" && (
          <CardActions sx={{ padding: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onApprove(request?._id || "")}
              sx={{ mr: 1, width: "100%" }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => onDeny(request?._id || "")}
              sx={{ width: "100%" }}
            >
              Deny
            </Button>
          </CardActions>
        )}
      </Box>
      <Box sx={{ padding: 2 }}>
        <Avatar
          alt={`${reqUser?.firstName} ${reqUser?.lastName}`}
          src={
            reqUser
              ? `${API_URL}${reqUser?.profilePicture}` || "/default-avatar.png"
              : "/default-avatar.png"
          }
          sx={{ width: 56, height: 56 }}
        />
      </Box>
    </Card>
  );
};

export default PermissionRequestCard;
