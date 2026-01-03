import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const Main = () => {
  const { authUser, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      await checkAuth();
      if (authUser) {
        // Mark that user has visited (logged in successfully)
        localStorage.setItem("hasVisited", "true");
        navigate("/home", { replace: true });
      } else {
        // Check if user has visited before
        const hasVisitedBefore = localStorage.getItem("hasVisited");

        if (hasVisitedBefore) {
          // Existing user with expired token - go to login
          navigate("/login", { replace: true });
        } else {
          // New user - go to landing
          navigate("/landing", { replace: true });
        }
      }
    };

    handleRedirect();
  }, [authUser, checkAuth, navigate]);

  return null;
};

export default Main;
