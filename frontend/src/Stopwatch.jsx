//Stopwatch.jsx

import API from "./api/url.js"; // adjust path if needed
import React, { useState, useEffect, useRef } from "react";

function StopWatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [masterElapsed, setMasterElapsed] = useState(0);
  const [segmentElapsed, setSegmentElapsed] = useState(0);
  const [logs, setLogs] = useState([]);

  const intervalRef = useRef(null);
  const masterStartRef = useRef(0);
  const segmentStartRef = useRef(0);

  // ⏱️ Timer effect
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      setMasterElapsed(now - masterStartRef.current);
      setSegmentElapsed(now - segmentStartRef.current);
    }, 10);

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // ▶️ Start
  function start() {
    const now = Date.now();
    masterStartRef.current = now - masterElapsed;
    segmentStartRef.current = now - segmentElapsed;
    setIsRunning(true);
  }

  // ⏹️ Stop
  function stop() {
    setIsRunning(false);
  }

  // 🔄 Reset / Log
async function resetSegment() {
  if (isRunning) {
    try {
      // ⚠️ you need a timerId (for now hardcode from Postman test)
      const timerId = "69edb7ed9a5d191f4817807e";

      const res = await API.put(`/reset/${timerId}`, {
        note: "manual reset",
        mood: "neutral"
      });

      console.log("Backend response:", res.data);

      // optional: still keep UI logs
      setLogs(prev => [
        ...prev,
        {
          id: prev.length + 1,
          segmentDuration: segmentElapsed,
          masterTimestamp: masterElapsed,
        },
      ]);

      // reset UI timer
      setSegmentElapsed(0);
      segmentStartRef.current = Date.now();

    } catch (err) {
      console.error("API error:", err);
    }

  } else {
    if (confirm("Are you sure you want reset the entire timer?")) {
      setLogs([]);
      setMasterElapsed(0);
      setSegmentElapsed(0);
      setIsRunning(false);
    }
  }
}

  // 🧠 Format time
  function formatTime(ms) {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const seconds = Math.floor((ms / 1000) % 60);
    const millis = Math.floor((ms % 1000) / 10);

    return {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
      millis: String(millis).padStart(2, "0"),
    };
  }

  const master = formatTime(masterElapsed);
  const segment = formatTime(segmentElapsed);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      
      {/* CARD */}
      <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-md">
         <div className="text-center mb-6"> Smoking </div>
        {/* MASTER */}
        <div className="text-center mb-6">
          <div className="text-gray-400 text-sm mb-1">MASTER</div>
          <div className="flex justify-center items-end gap-1 font-mono">
            <span className="text-xs text-gray-500">{master.days}d</span>
            <span className="text-3xl">{master.hours}</span>:
            <span className="text-3xl">{master.minutes}</span>:
            <span className="text-3xl">{master.seconds}</span>:
            <span className="text-lg text-gray-400">{master.millis}</span>
          </div>
        </div>

        {/* SEGMENT */}
        <div className="text-center mb-6">
          <div className="text-gray-400 text-sm mb-1">SEGMENT</div>
          <div className="flex justify-center items-end gap-1 font-mono">
            <span className="text-xs text-gray-500">{segment.days}d</span>
            <span className="text-2xl">{segment.hours}</span>:
            <span className="text-2xl">{segment.minutes}</span>:
            <span className="text-2xl">{segment.seconds}</span>:
            <span className="text-sm text-gray-400">{segment.millis}</span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex justify-center gap-4">
          <button
            onClick={start}
            disabled={isRunning}
            className={`px-4 py-2 rounded-xl font-semibold ${
              isRunning
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            Start
          </button>

          <button
            onClick={stop}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-semibold"
          >
            Stop
          </button>

          <button
            onClick={resetSegment}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-xl font-semibold text-black"
          >
            Reset
          </button>
        </div>
      </div>

      {/* LOGS */}
      <div className="mt-8 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-3 text-center">Logs</h3>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {logs.map(log => {
            const seg = formatTime(log.segmentDuration);
            const mst = formatTime(log.masterTimestamp);

            return (
              <div
                key={log.id}
                className="bg-gray-800 p-3 rounded-lg flex justify-between text-sm"
              >
              
                <span className="text-gray-400">#{log.id}</span>

                <span className="font-mono">
                  {seg.hours}:{seg.minutes}:{seg.seconds}
                </span>

                <span className="text-gray-500 font-mono">
                  {mst.hours}:{mst.minutes}:{mst.seconds}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StopWatch;