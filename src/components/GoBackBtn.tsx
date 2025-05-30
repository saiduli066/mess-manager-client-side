import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GoBackBtn = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-white text-sm md:text-base hover:text-purple-300 transition px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/20"
    >
      <ArrowLeft size={18} />
      <span className="inline">Go Back</span>
    </button>
  );
};

export default GoBackBtn;
