import { useAuthStore } from "@/store/useAuthStore";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import RippleLoader from "@/components/RippleLoader";

const ProtectRoutes = ({ children }: { children: ReactNode }) => {
  const { authUser, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  if (isCheckingAuth) {
    return (
      <RippleLoader size="lg" />
    );
  }

  if (!authUser && !isCheckingAuth) {
    // Check if user has visited before (existing user with expired token)
    const hasVisitedBefore = localStorage.getItem("hasVisited");

    if (hasVisitedBefore) {
      // Existing user with expired token - redirect to login
      return <Navigate to="/login" state={{ from: location }} replace />;
    } else {
      // New user - redirect to landing page
      return <Navigate to="/landing" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectRoutes;