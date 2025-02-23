import React from "react";
import { Button, Typography, Container } from "@mui/material";
import "../style/HomePage.scss";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  return (
    <Container className="home-container">
      <Typography variant="h4" className="welcome-message">
        wellcome, {user?.userName}!
      </Typography>
      <div className="buttons-container">
        <Button variant="contained" color="primary" className="home-button" onClick={() => navigate("/countries")}>
          watch all countries
        </Button>
        <Button variant="contained" color="secondary" className="home-button" onClick={() => navigate("/cities")}>
          watch all cities
        </Button>
        {user && user.role == "Admin" && (
          <Button variant="contained" color="success" className="home-button" onClick={() => navigate("/allusers")}>
            watch all users
          </Button>
        )}
      </div>
    </Container>
  );
};

export default HomePage;
