import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

type NoMessFoundProps = {
    message?: string;
    actionText?: string;
};

const NoMessFound = ({
    message = "You need to join or create a mess to access this feature.",
    actionText = "Join or Create a Mess"
}: NoMessFoundProps) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <Card className="w-full max-w-md mx-auto rounded-xl shadow-2xl bg-[#1A2332]/50 border border-[#7E22CE]/20 backdrop-blur-sm">
                <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                        <div className="relative bg-[#1A2332] p-4 rounded-full border border-[#7E22CE]/30">
                            <Users className="w-10 h-10 text-[#9D47DE]" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white tracking-tight">
                            No Mess Found
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                            {message}
                        </p>
                    </div>

                    <Button
                        className="w-full bg-gradient-to-r from-[#7E22CE] to-[#9D47DE] hover:from-[#6B1AB5] hover:to-[#8B36CF] text-white font-semibold shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]"
                        size="lg"
                        onClick={() => navigate("/entry-options")}
                    >
                        {actionText}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default NoMessFound;
