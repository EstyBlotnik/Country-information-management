import { Button } from "@mui/material";

interface Props {
  filter: "All" | "Approved" | "Denied" | "Pending";
  setFilter: (filter: "All" | "Approved" | "Denied" | "Pending") => void;
}

const PermissionRequestsHeader: React.FC<Props> = ({ filter, setFilter }) => {
  const statuses = ["All", "Pending", "Approved", "Denied"];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "16px",
        borderBottom: "2px solid #ddd",
        paddingBottom: "8px",
        marginBottom: "16px",
      }}
    >
      {statuses.map((status) => (
        <Button
          key={status}
          onClick={() => setFilter(status as any)}
          sx={{
            textTransform: "none",
            fontWeight: filter === status ? "bold" : "normal",
            borderBottom: filter === status ? "2px solid blue" : "none",
            borderRadius: 0,
            paddingBottom: "4px",
          }}
        >
          {status}
        </Button>
      ))}
    </div>
  );
};

export default PermissionRequestsHeader;
