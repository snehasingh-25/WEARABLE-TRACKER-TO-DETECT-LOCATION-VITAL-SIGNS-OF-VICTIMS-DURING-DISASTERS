const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const WearableData = require("./models/WearableData");

const app = express();
app.use(cors());
app.use(express.json());

// ------------------ MONGO CONNECTION ------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✔"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ------------------ ROUTES ----------------------------

app.get("/", (req, res) => {
  res.send("ESP32 Backend Running + MongoDB Connected!");
});

app.post("/data", async (req, res) => {
  try {
    console.log("Incoming data from ESP32:", req.body);

    const { bpm, lat, lng, sos } = req.body;

    // save to MongoDB
    const entry = new WearableData({ bpm, lat, lng, sos });
    await entry.save();

    res.json({ status: "stored", entry });
  } catch (error) {
    res.status(500).json({ error: "Failed to save data", details: error });
  }
});

app.get("/latest", async (req, res) => {
  try {
    const latest = await WearableData.findOne().sort({ timestamp: -1 });
    if (!latest) {
      return res.status(404).json({ message: "No data found" });
    }
    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch latest data", details: error });
  }
});


// -------------------------------------------------------

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Backend running on port", port));
