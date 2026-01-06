import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const checkOnlineAndWarn = (action?: string): boolean => {
    if (!isOnline) {
      toast.error(`No Internet Connection`, {
        description: `You need an internet connection to ${
          action || "perform this action"
        }. Please check your connection and try again.`,
        duration: 4000,
      });
      return false;
    }
    return true;
  };

  return { isOnline, checkOnlineAndWarn };
};
