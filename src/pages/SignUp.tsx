import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
      <div className="min-h-screen w-full text-black flex items-center justify-center bg-gradient-to-br from-[#0F1729] via-[#1F2B45] to-[#3B4A6B] px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign up</h2>
       

              <form className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                          type="text"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                  </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

      

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>


          <button
            type="submit"
                      className="w-full bg-[#7E22CE] cursor-pointer text-white font-semibold py-2 rounded-full hover:bg-[#7E02CE] transition"
          >
            Sign up
          </button>
        </form>

        <p className="text-sm text-gray-600 my-4">
         Already have an account?{" "}
                  <Link to="/login" className="text-[#7E22CE] font-medium hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
