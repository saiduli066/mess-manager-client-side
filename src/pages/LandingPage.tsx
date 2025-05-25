import { Link } from "react-router-dom";
import messHero from "../assets/hero-img.png";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0F1729] text-white overflow-x-hidden">
      {/* Navbar */}
          <header className="w-full px-4 sm:px-8 py-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                  <h1 className="text-2xl font-bold text-white">
                      Mess<span className="text-[#7E22CE]">Manager</span>
                  </h1>

                  <nav className="hidden md:flex gap-6 text-sm font-medium">
                      <a href="#features" className="hover:text-[#9D47DE]">Features</a>
                      <a href="#about" className="hover:text-[#9D47DE]">About</a>
                      <a href="#contact" className="hover:text-[#9D47DE]">Contact</a>
                  </nav>

                  <div className="flex gap-3">
                      {/* Hide login button on small screens */}
                      <Link
                          to="/login"
                          className="px-4 py-2 border border-[#7E22CE] text-[#7E22CE] rounded-full hover:bg-[#7E22CE] hover:text-white transition hidden md:inline-block"
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
      <section className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 py-16 gap-10 w-full">
        {/* Text */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Managing Mess <br /> Made <span className="text-[#9D47DE]">Simple</span>
          </h2>
          <p className="mt-4 text-gray-300 text-sm sm:text-base">
            Keep track of meals, costs, and members in your mess with ease. Everything in one place, designed for comfort and control.
          </p>
          <Link
            to="/sign-up"
            className="mt-6 inline-block px-6 py-3 bg-[#7E22CE] text-white rounded-full font-medium hover:bg-[#6B1AB5] transition"
          >
            Get Started
          </Link>
        </div>

        {/*hero Image */}
        <div className="w-full md:w-1/2 relative max-w-full">
          <img
            src={messHero}
            alt="Mess Management"
            className="rounded-lg drop-shadow-lg w-full h-auto"
          />
          <div className="absolute -top-5 -left-5 w-20 h-20 bg-[#7E22CE] rounded-full opacity-30 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-6 -right-6 w-14 h-14 bg-[#9D47DE] rounded-full opacity-20 blur-lg pointer-events-none"></div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
