import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../api/url";
import { Play, Square, RotateCcw } from "lucide-react";

export default function TimerPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [timer, setTimer] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [masterElapsed, setMasterElapsed] = useState(0);
  const [segmentElapsed, setSegmentElapsed] = useState(0);
  const [logs, setLogs] = useState([]);

  const masterStartRef = useRef(0);

  // 🔄 FETCH TIMER
  const fetchTimer = async () => {
    try {
      const res = await API.get(`/${id}`);
      setTimer(res.data);
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTimer();
  }, []);

  // 🧠 INITIAL SYNC (CRITICAL)
  useEffect(() => {
    if (!timer) return;

    const start = new Date(timer.startTime).getTime();
    const now = Date.now();

    masterStartRef.current = start;

    setIsRunning(!!timer.segmentStartTime);

    setMasterElapsed(now - start);

    if (timer.segmentStartTime) {
      const segStart = new Date(timer.segmentStartTime).getTime();
      setSegmentElapsed(now - segStart);
    } else {
      setSegmentElapsed(0);
    }

  }, [timer]);

  // 🔥 MASTER TIMER
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setMasterElapsed(now - masterStartRef.current);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // 🔥 SEGMENT TIMER (ONLY ONE)
  useEffect(() => {
    if (!isRunning || !timer?.segmentStartTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const segStart = new Date(timer.segmentStartTime).getTime();

      setSegmentElapsed(now - segStart);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timer?.segmentStartTime]);

  // ▶ START
  const start = async () => {
    try {
      await API.put(`/start-segment/${id}`);
      await fetchTimer();
    } catch (err) {
      console.error(err);
    }
  };

  // ⏹ STOP
const stop = async () => {
  try {
    await API.put(`/stop-segment/${id}`);
    await fetchTimer(); // backend will return segmentStartTime = null
  } catch (err) {
    console.error(err);
  }
};

  // 🔁 RESET
  const reset = async () => {
    try {
      if (isRunning) {
        await API.put(`/reset/${id}`, {
          note: "manual reset"
        });

        // 🔥 instant UI update
        const newStart = new Date().toISOString();

        setTimer(prev => ({
          ...prev,
          segmentStartTime: newStart
        }));

        setSegmentElapsed(0);

        await fetchTimer();

      } else {
        const confirmReset = confirm(
          "Reset whole timer and lose logs?"
        );

        if (!confirmReset) return;

        await API.delete(`/${id}`);
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("RESET ERROR 👉", err);
    }
  };

  // 🧮 FORMAT TIME
const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);

  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600) % 24;
  const d = Math.floor(totalSeconds / 86400); // 🔥 days

return d > 0
  ? `${d}d ${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  : `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};
  if (!timer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-gray-200 flex items-center justify-center">
        <p className="text-lg text-gray-400 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-gray-200 flex flex-col items-center justify-center px-6">

      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-gray-400 hover:text-white transition"
      >
        ← Back
      </button>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 w-full max-w-md text-center shadow-2xl">

        <h1 className="text-xl mb-6 tracking-wide text-gray-300">
          {timer.name}
        </h1>

        <p className="text-xs text-gray-500">MASTER</p>
        <h1 className="text-5xl font-mono tracking-widest mb-8 text-white">
          {formatTime(masterElapsed)}
        </h1>

        <p className="text-xs text-gray-500">SEGMENT</p>
        <h2 className="text-3xl font-mono mb-10 text-gray-300">
          {formatTime(segmentElapsed)}
        </h2>

        <div className="flex justify-center gap-6">

          <button
            onClick={start}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition shadow-lg
              ${isRunning
                ? "bg-green-500/10 border border-green-300/20 cursor-not-allowed"
                : "bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 hover:scale-110 active:scale-95"
              }`}
          >
            <Play className="text-green-400" size={28} />
          </button>

          <button
            onClick={stop}
            className="w-16 h-16 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 flex items-center justify-center transition hover:scale-110 active:scale-95 shadow-lg"
          >
            <Square className="text-red-400" size={24} />
          </button>

          <button
            onClick={reset}
            className="w-16 h-16 rounded-full bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-300/30 flex items-center justify-center transition hover:scale-110 active:scale-95 shadow-lg"
          >
            <RotateCcw className="text-yellow-300" size={26} />
          </button>

        </div>

        <div className="mt-10 w-full text-left">

          <h3 className="text-lg text-gray-400 mb-4">
            Reset Logs ({logs.length})
          </h3>

          <div className="space-y-2 max-h-60 overflow-y-auto">

            {logs.map((log, index) => (
              <div
                key={log._id}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex justify-between text-sm"
              >
                <span className="text-gray-500">
                  #{logs.length - index}
                </span>

                <span className="font-mono text-gray-200">
                  {formatTime(log.duration)}
                </span>

                <span className="text-gray-400 font-mono">
                  @ {formatTime(log.masterTime)}
                </span>
              </div>
            ))}

            {logs.length === 0 && (
              <p className="text-gray-500 text-sm">No logs yet</p>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}