import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

type LoginFormData = {
    email: string;
    password: string;
};

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });

    const { isLoggingIn, login } = useAuthStore();

    const validateForm = (): boolean => {
        const { email, password } = formData;

        if (!email.trim()) {
            toast.error("Email is required");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Invalid email format");
            return false;
        }

        if (!password.trim()) {
            toast.error("Password is required");
            return false;
        }

        return true;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isValid = validateForm();
        if (!isValid) return;

        await login(formData);

        if (useAuthStore.getState().authUser) {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1f0036] via-[#1F3B45] to-[#3c006f]  px-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl text-white w-full max-w-md p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-1 text-center">Welcome Back</h2>
                <p className="text-sm text-white/70 text-center mb-6">Sign in to your account</p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full bg-[#7E22CE] hover:bg-[#7E02CE] text-white font-semibold py-2 rounded-full transition"
                    >
                        {isLoggingIn ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="text-sm text-white/70 mt-6 text-center">
                    Don’t have an account?{" "}
                    <Link to="/sign-up" className="text-purple-400 hover:underline font-medium">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
