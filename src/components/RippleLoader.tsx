import logoUrl from "@/assets/un-mess-new_logo2-removebg.png";

type RippleLoaderProps = {
  size?: "sm" | "md" | "lg" | "xl";
};

function RippleLoader({ size = "md" }: RippleLoaderProps) {

  const sizeClasses = {
    sm: { container: "w-24 h-24", logo: "w-12 h-12" },
    md: { container: "w-40 h-40", logo: "w-20 h-20" },
    lg: { container: "w-64 h-64", logo: "w-32 h-32" },
    xl: { container: "w-96 h-96", logo: "w-48 h-48" },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F1729]">
      <style>{`
                @keyframes pulse-ring {
                    0% { transform: scale(0.5); opacity: 0.8; }
                    100% { transform: scale(1.8); opacity: 0; }
                }
                .animate-pulse-ring {
                    animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
                }
            `}</style>

      <div className={`relative ${currentSize.container} flex items-center justify-center`}>
        <div
          className="absolute rounded-full border-4 border-purple-500/60 animate-pulse-ring"
          style={{ width: "100%", height: "100%" }}
        ></div>

        <div
          className="absolute rounded-full border-4 border-purple-400/40 animate-pulse-ring"
          style={{ width: "100%", height: "100%", animationDelay: "0.4s" }}
        ></div>

        <div
          className="absolute rounded-full border-4 border-purple-300/20 animate-pulse-ring"
          style={{ width: "100%", height: "100%", animationDelay: "0.8s" }}
        ></div>

        <div className={`${currentSize.logo} relative z-10 bg-[#1A2332] rounded-full p-3 shadow-2xl shadow-purple-500/20 border border-purple-500/30 flex items-center justify-center backdrop-blur-sm`}>
          <img
            src={logoUrl}
            alt="Loading..."
            className="w-full h-full object-contain animate-pulse"
            onError={(e) => {
              console.log("Image failed to load");
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default RippleLoader;
