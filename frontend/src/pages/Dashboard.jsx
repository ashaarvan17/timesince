//Dashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/url.js";

export default function Dashboard() {
  const [timers, setTimers] = useState([]);
  const navigate = useNavigate();

const fetchTimers = async () => {
  try {
    const res = await API.get("");
    console.log("API RESPONSE:", res.data); // 👈 ADD THIS
    setTimers(res.data);
  } catch (err) {
    console.error("FETCH ERROR:", err);
  }
};

  useEffect(() => {
    fetchTimers();
  }, []);

  const createTimer = async () => {
  const name = prompt("Enter timer name");

  if (!name || name.trim() === "") return;

  try {
    await API.post("", {
      userId: "user123", // 🔥 replace later with real user
      name
    });

    fetchTimers(); // refresh list
  } catch (err) {
    console.error("CREATE ERROR:", err);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-gray-200 p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-semibold tracking-wide">
          Your Timers
        </h1>

        <div className="text-sm text-gray-400">
          profile • logout
        </div>
      </div>

      {/* GRID */}
      <div className="flex gap-8 flex-wrap justify-center">

        {timers.map(timer => (
          <div
            key={timer._id}
            onClick={() => navigate(`/timer/${timer._id}`)}
            className="w-44 h-44 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <div className="w-28 h-28 bg-black text-white rounded-full flex items-center justify-center text-center text-lg tracking-wide">
              {timer.name}
            </div>
          </div>
        ))}

        {/* ADD NEW */}
        <div
  onClick={createTimer}
  className="w-44 h-44 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300"
>
  + New Timer
</div>

      </div>
    </div>
  );
}