import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showToast, setShowToast] = useState(!navigator.onLine); // Show immediately if offline

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowToast(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!showToast && isOnline) return null;

    return (
        <div
            className={`fixed top-3 right-3 z-50 px-2.5 py-1.5 rounded-md shadow-lg transition-all duration-300 ${isOnline
                ? 'bg-green-500/90 backdrop-blur-sm'
                : 'bg-red-500/90 backdrop-blur-sm'
                }`}
        >
            <div className="flex items-center gap-1.5">
                {isOnline ? (
                    <>
                        <Wifi className="w-3.5 h-3.5 text-white" />
                        <p className="text-white font-medium text-xs">Back to online</p>
                    </>
                ) : (
                    <>
                        <WifiOff className="w-3.5 h-3.5 text-white" />
                        <p className="text-white font-medium text-xs">You're Offline</p>
                    </>
                )}
            </div>
        </div>
    );
};
