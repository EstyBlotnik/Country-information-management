import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../useUser";

// Checks if the current user has "Admin" permissions. 
// If not, it redirects them to the home page ("/home").
const useAdminAuth = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  useEffect(() => {
    if (!isLoading && (!user || !(user.role === "Admin"))) {
      navigate("/home");
    }
  }, [user, isLoading, navigate]);
};

export default useAdminAuth;
