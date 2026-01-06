import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(0);

    useEffect(() => {
        if (cooldownTime > 0) {
            const timer = setTimeout(() => {
                setCooldownTime(cooldownTime - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldownTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        if (cooldownTime > 0) {
            toast.error(`Please wait ${formatTime(cooldownTime)} before requesting again`);
            return;
        }

        setIsLoading(true);
        try {
            await axiosInstance.post("/auth/forgot-password", { email });
            setEmailSent(true);
            setCooldownTime(180); // 3 minutes
            toast.success("Password reset email sent! Check your inbox.");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send reset email");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendEmail = () => {
        setEmailSent(false);
    };

    return (
        <div className="min-h-screen bg-[#0F1729] p-4 sm:p-6">
            <div className="max-w-md mx-auto">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    className="mb-4 text-gray-300 hover:bg-[#1A2332] hover:text-[#9D47DE]"
                    onClick={() => navigate("/login")}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                </Button>

                {/* Main Card */}
                <Card className="border-[#7E22CE]/30 shadow-2xl bg-[#1A2332]">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl font-bold text-white">
                            {emailSent ? "Check Your Email" : "Forgot Password?"}
                        </CardTitle>
                        {!emailSent && (
                            <p className="text-sm text-gray-400">
                                Enter your email address and we'll send you a link to reset your password
                            </p>
                        )}
                    </CardHeader>
                    <CardContent className="p-6">
                        {emailSent ? (
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle2 className="w-10 h-10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-white">
                                        We've sent a password reset link to
                                    </p>
                                    <p className="text-[#9D47DE] font-semibold text-lg break-all">
                                        {email}
                                    </p>
                                </div>
                                <div className="bg-[#0F1729] border border-[#7E22CE]/30 rounded-lg p-4">
                                    <p className="text-sm text-gray-400">
                                        Please check your inbox and follow the instructions to reset your password.
                                        <span className="block mt-2 text-amber-500">
                                            The link will expire in 1 hour.
                                        </span>
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Button
                                        className="w-full bg-[#7E22CE] hover:bg-[#6B1AB5] text-white h-11 font-semibold shadow-lg hover:shadow-[#7E22CE]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleResendEmail}
                                        disabled={cooldownTime > 0}
                                    >
                                        {cooldownTime > 0 ? (
                                            <>
                                                <Clock className="w-4 h-4 mr-2" />
                                                Resend in {formatTime(cooldownTime)}
                                            </>
                                        ) : (
                                            "Resend Email"
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full border-[#7E22CE]/30 text-white hover:bg-[#1A2332] h-11"
                                        onClick={() => navigate("/login")}
                                    >
                                        Back to Login
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-white flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-[#9D47DE]" />
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your-email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        className="bg-[#0F1729] border-[#7E22CE]/30 text-white placeholder:text-gray-500 focus:border-[#7E22CE] h-11"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-[#7E22CE] hover:bg-[#6B1AB5] text-white h-11 font-semibold shadow-lg hover:shadow-[#7E22CE]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading || cooldownTime > 0}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                            Sending...
                                        </>
                                    ) : cooldownTime > 0 ? (
                                        <>
                                            <Clock className="w-4 h-4 mr-2" />
                                            Wait {formatTime(cooldownTime)}
                                        </>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
