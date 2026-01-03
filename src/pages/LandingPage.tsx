import { Link } from "react-router-dom";
import messHero from "../assets/hero-img.png";
import { ChefHat, Users, Receipt, TrendingUp, Shield, Clock } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0F1729] text-white overflow-x-hidden">
      {/* Navbar */}
      <header className="w-full px-4 sm:px-8 py-6 sticky top-0 bg-[#0F1729]/95 backdrop-blur-sm z-50 border-b border-gray-800/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-white">
            Mess<span className="text-[#7E22CE]">Manager</span>
          </h1>

          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-[#9D47DE] transition">Features</a>
            <a href="#how-it-works" className="hover:text-[#9D47DE] transition">How it Works</a>
            <a href="#benefits" className="hover:text-[#9D47DE] transition">Benefits</a>
          </nav>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 border border-[#7E22CE] text-[#7E22CE] rounded-full hover:bg-[#7E22CE] hover:text-white transition hidden sm:inline-block"
            >
              Login
            </Link>
            <Link
              to="/sign-up"
              className="px-4 py-2 bg-[#7E22CE] rounded-full hover:bg-[#6B1AB5] transition w-full sm:w-auto text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 py-12 md:py-20 gap-10 w-full">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <div className="inline-block mb-4 px-4 py-2 bg-[#7E22CE]/10 border border-[#7E22CE]/30 rounded-full text-[#9D47DE] text-sm font-medium">
            ✨ Smart Mess Management Solution
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Managing Mess <br /> Made <span className="text-[#9D47DE]">Simple</span>
          </h2>
          <p className="mt-6 text-gray-300 text-base sm:text-lg leading-relaxed">
            Streamline your mess operations with our all-in-one platform. Track meals, manage deposits, split bills, and keep everyone informed - all in real-time.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/sign-up"
              className="px-8 py-3 bg-[#7E22CE] text-white rounded-full font-medium hover:bg-[#6B1AB5] transition shadow-lg shadow-[#7E22CE]/20"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border border-gray-700 text-white rounded-full font-medium hover:bg-gray-800/50 transition"
            >
              Sign In
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">No credit card required • Free forever</p>
        </div>

        <div className="w-full md:w-1/2 relative max-w-full">
          <img
            src={messHero}
            alt="Mess Management Dashboard"
            className="rounded-2xl drop-shadow-2xl w-full h-auto border border-gray-800/50"
          />
          <div className="absolute -top-5 -left-5 w-32 h-32 bg-[#7E22CE] rounded-full opacity-20 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#9D47DE] rounded-full opacity-20 blur-2xl pointer-events-none"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to manage your mess efficiently</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-800 hover:border-[#7E22CE]/50 transition">
            <div className="w-12 h-12 bg-[#7E22CE]/10 rounded-lg flex items-center justify-center mb-4">
              <ChefHat className="w-6 h-6 text-[#9D47DE]" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Meal Tracking</h4>
            <p className="text-gray-400 text-sm">Track daily meals for each member with automatic counting and reporting</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-800 hover:border-[#7E22CE]/50 transition">
            <div className="w-12 h-12 bg-[#7E22CE]/10 rounded-lg flex items-center justify-center mb-4">
              <Receipt className="w-6 h-6 text-[#9D47DE]" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Bill Management</h4>
            <p className="text-gray-400 text-sm">Create and split bills automatically with accurate per-head calculations</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-800 hover:border-[#7E22CE]/50 transition">
            <div className="w-12 h-12 bg-[#7E22CE]/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[#9D47DE]" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Member Management</h4>
            <p className="text-gray-400 text-sm">Add members, assign roles, and manage permissions effortlessly</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-800 hover:border-[#7E22CE]/50 transition">
            <div className="w-12 h-12 bg-[#7E22CE]/10 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-[#9D47DE]" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Real-time Analytics</h4>
            <p className="text-gray-400 text-sm">View detailed statistics and reports for better decision making</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-800 hover:border-[#7E22CE]/50 transition">
            <div className="w-12 h-12 bg-[#7E22CE]/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[#9D47DE]" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Secure & Private</h4>
            <p className="text-gray-400 text-sm">Your data is encrypted and stored securely with role-based access</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-800 hover:border-[#7E22CE]/50 transition">
            <div className="w-12 h-12 bg-[#7E22CE]/10 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-[#9D47DE]" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Save Time</h4>
            <p className="text-gray-400 text-sm">Automate repetitive tasks and focus on what matters most</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="px-4 sm:px-8 py-16 md:py-24 bg-gradient-to-b from-transparent to-[#1a1f35]/50">
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">Get started in three simple steps</p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#7E22CE] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
            <h4 className="text-xl font-semibold mb-2">Create Your Mess</h4>
            <p className="text-gray-400 text-sm">Sign up and create a new mess or join an existing one with a code</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-[#7E22CE] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
            <h4 className="text-xl font-semibold mb-2">Add Members</h4>
            <p className="text-gray-400 text-sm">Invite members to join your mess and assign admin roles</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-[#7E22CE] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
            <h4 className="text-xl font-semibold mb-2">Start Managing</h4>
            <p className="text-gray-400 text-sm">Track meals, manage deposits, and create bills effortlessly</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="benefits" className="px-4 sm:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-[#7E22CE]/10 to-[#9D47DE]/5 border border-[#7E22CE]/30 rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of messes already using MessManager to simplify their operations
          </p>
          <Link
            to="/sign-up"
            className="inline-block px-10 py-4 bg-[#7E22CE] text-white rounded-full font-medium hover:bg-[#6B1AB5] transition shadow-lg shadow-[#7E22CE]/20 text-lg"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-8 py-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>© 2026 MessManager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
