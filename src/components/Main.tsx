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
        navigate("/home", { replace: true });
      } else {
        navigate("/landing", { replace: true });
      }
    };

    handleRedirect();
  }, [authUser, checkAuth, navigate]);

  return null; 
};

export default Main;
