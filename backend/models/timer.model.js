import mongoose from "mongoose";

const timerSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // later you can change to ObjectId if you create User model
      required: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    startTime: {
      type: Date,
      default: Date.now,
      required: true
    },

    segmentStartTime: {
  type: Date,
  default: null
},

    reminderHours: {
      type: Number,
      default: 24,
      min: 1
    }
  },
  { timestamps: true }
);

// Optional: index for faster queries (important when scaling)
timerSchema.index({ userId: 1 });

export default mongoose.model("Timer", timerSchema);