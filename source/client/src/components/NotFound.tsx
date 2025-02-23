import React from "react";
import { Box, Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Box sx={{ textAlign: "center", padding: "20px" }}>
      <Typography variant="h4" color="error">
        404 Not Found
      </Typography>
      <Typography variant="body1">The page you are looking for does not exist.</Typography>
    </Box>
  );
};

export default NotFound;
