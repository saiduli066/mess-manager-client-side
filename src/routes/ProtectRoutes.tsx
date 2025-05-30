import { useAuthStore } from "@/store/useAuthStore";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ProtectRoutes = ({ children }: { children: ReactNode }) => {
  const { authUser, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121b31]">
        <DotLottieReact
          src="https://lottie.host/26dfed0f-655e-4d48-bbd1-86cc7bdfd29c/Ia0U6ar4rU.lottie"
          loop
          autoplay
        />
      </div>
    );
  }

  if (!authUser && !isCheckingAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectRoutes;