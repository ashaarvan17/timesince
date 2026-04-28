import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-black text-white flex flex-col items-center justify-center text-center px-6">

      {/* TITLE */}
      <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
        TimeSince
      </h1>

      {/* TAGLINE */}
      <p className="text-gray-400 max-w-xl mb-10 text-lg">
        Track the time since your last habit, action, or event.  
        Build awareness. Improve behavior. Stay consistent.
      </p>

      {/* BUTTON */}
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-white text-black px-8 py-3 rounded-full text-lg font-medium hover:scale-105 transition-all"
      >
        Get Started →
      </button>

    </div>
  );
}