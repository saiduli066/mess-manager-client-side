import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        setIsLoading(true);
        try {
            await axiosInstance.post("/auth/forgot-password", { email });
            setEmailSent(true);
            toast.success("Password reset email sent! Check your inbox.");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send reset email");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                    <Button
                        variant="ghost"
                        className="w-fit mb-4 text-white hover:bg-white/10"
                        onClick={() => navigate("/login")}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                    </Button>
                    <CardTitle className="text-2xl text-center text-white">
                        {emailSent ? "Check Your Email" : "Forgot Password?"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {emailSent ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                                <Mail className="w-8 h-8 text-green-400" />
                            </div>
                            <p className="text-white/80">
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                            <p className="text-white/60 text-sm">
                                Please check your inbox and follow the instructions to reset your password.
                                The link will expire in 1 hour.
                            </p>
                            <Button
                                className="w-full bg-white text-purple-900 hover:bg-white/90"
                                onClick={() => navigate("/login")}
                            >
                                Back to Login
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <p className="text-white/80 text-center">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your-email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-white text-purple-900 hover:bg-white/90"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-900 mr-2"></div>
                                        Sending...
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
    );
};

export default ForgotPassword;
