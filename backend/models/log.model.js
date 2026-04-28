import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    timerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timer",
      required: true
    },

    startTime: {
      type: Date,
      required: true
    },

    resetTime: {
      type: Date,
      required: true
    },

    duration: {
      type: Number, // segment duration
      required: true,
      min: 0
    },

    masterTime: {
      type: Number, // 🔥 total timer elapsed at reset
      required: true,
      min: 0
    },

    note: {
      type: String,
      default: "",
      trim: true
    }
  },
  { timestamps: true }
);

logSchema.index({ timerId: 1 });

export default mongoose.model("Log", logSchema);