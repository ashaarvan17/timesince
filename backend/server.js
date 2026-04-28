import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import timerRoutes from "./routes/timer.routes.js";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes (define BEFORE DB connect is also fine)
app.use("/api/timers", timerRoutes);

app.get("/debug", (req, res) => {
  res.send("THIS IS MY SERVER");
});

// ✅ Use dynamic PORT
const PORT = process.env.PORT || 4001;

// ✅ Connect DB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });