//timer.routes.js

import express from "express";
import mongoose from "mongoose";
import Timer from "../models/timer.model.js";
import Log from "../models/log.model.js";

const router = express.Router();


// ✅ CREATE TIMER
router.post("/", async (req, res) => {
  try {
    const { userId, name, reminderHours } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ message: "userId and name are required" });
    }

    const timer = await Timer.create({
      userId,
      name,
      reminderHours: reminderHours || 24
    });

    res.status(201).json(timer);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ GET ALL TIMERS
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};

    const timers = await Timer.find(filter).sort({ createdAt: -1 });
    res.json(timers);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ GET TIMER + LOGS
router.get("/:id", async (req, res) => {
  try {
    const timer = await Timer.findById(req.params.id);

    if (!timer) {
      return res.status(404).json({ message: "Timer not found" });
    }

    const logs = await Log.find({ timerId: timer._id })
      .sort({ createdAt: -1 });

    res.json({
      ...timer.toObject(),
      logs
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ▶ START SEGMENT
router.put("/start-segment/:id", async (req, res) => {
  try {
    const timer = await Timer.findById(req.params.id);

    if (!timer) {
      return res.status(404).json({ message: "Timer not found" });
    }

    if (timer.segmentStartTime) {
      return res.json({ message: "Already running" });
    }

    timer.segmentStartTime = new Date();
    await timer.save();

    res.json({ message: "Segment started" });

  } catch (err) {
    console.error("START ERROR 👉", err);
    res.status(500).json({ error: err.message });
  }
});


// ⏹ STOP SEGMENT
router.put("/stop-segment/:id", async (req, res) => {
  try {
    const timer = await Timer.findById(req.params.id);

    if (!timer) {
      return res.status(404).json({ message: "Timer not found" });
    }

    if (!timer.segmentStartTime) {
      return res.json({ message: "Already stopped" });
    }

    timer.segmentStartTime = null;
    await timer.save();

    res.json({ message: "Segment stopped" });

  } catch (err) {
    console.error("STOP ERROR 👉", err);
    res.status(500).json({ error: err.message });
  }
});


// 🔁 RESET TIMER (🔥 CORRECT LOGIC)
router.put("/reset/:id", async (req, res) => {
  try {
    const { note = "" } = req.body;

    const timer = await Timer.findById(req.params.id);

    if (!timer) {
      return res.status(404).json({ message: "Timer not found" });
    }

    const now = Date.now();

// ✅ safe master start
const masterStart = timer.startTime
  ? new Date(timer.startTime).getTime()
  : now;

// 🚨 guard
if (!masterStart || isNaN(masterStart)) {
  return res.status(400).json({ message: "Invalid startTime" });
}

// ✅ safe segment start
let segmentStart;

if (timer.segmentStartTime) {
  segmentStart = new Date(timer.segmentStartTime).getTime();

  if (isNaN(segmentStart)) {
    segmentStart = masterStart;
  }
} else {
  segmentStart = masterStart;
}

// ✅ calculations
const masterTime = now - masterStart;
const duration = now - segmentStart;

// 🚨 final guard
if (
  isNaN(masterTime) ||
  isNaN(duration) ||
  duration < 0
) {
  console.log("❌ INVALID CALCULATION", {
    masterStart,
    segmentStart,
    now
  });

  return res.status(400).json({
    message: "Invalid time calculation"
  });
}

    // ✅ HARD VALIDATION
    if (
      isNaN(masterTime) ||
      isNaN(duration) ||
      duration < 0
    ) {
      console.log("❌ INVALID DATA", {
        masterStart,
        segmentStart,
        now
      });

      return res.status(400).json({
        message: "Invalid time calculation"
      });
    }

    const log = await Log.create({
      timerId: timer._id, // ✅ correct (ObjectId)
      startTime: masterStart,
      resetTime: now,
      duration,
      masterTime,
      note
    });

    // restart segment
    timer.segmentStartTime = now;
    await timer.save();

    res.json({
      message: "Timer reset",
      log
    });

  } catch (err) {
    console.error("🔥 RESET ERROR FULL:", err);
    res.status(500).json({ error: err.message });
  }
});

// ❌ DELETE TIMER
router.delete("/:id", async (req, res) => {
  try {
    const timer = await Timer.findByIdAndDelete(req.params.id);

    if (!timer) {
      return res.status(404).json({ message: "Timer not found" });
    }

    await Log.deleteMany({ timerId: timer._id });

    res.json({ message: "Timer and logs deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


console.log("Timer routes loaded");

export default router;