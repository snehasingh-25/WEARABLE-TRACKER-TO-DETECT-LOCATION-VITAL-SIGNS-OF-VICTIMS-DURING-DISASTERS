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

    const { userId, name, bpm, lat, lng, sos } = req.body;

    const entry = new WearableData({ userId, name, bpm, lat, lng, sos });
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

app.get("/latest3", async (req, res) => {
  try {
    const latestThree = await WearableData.find().sort({ timestamp: -1 }).limit(3);
    res.json(latestThree);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch latest 3 entries", details: error });
  }
});


// -------------------------------------------------------


app.get("/rescuer/latest-all", async (req, res) => {
  try {
    const latestPerUser = await WearableData.aggregate([
      { $sort: { timestamp: -1 } }, // latest first
      {
        $group: {
          _id: "$userId",
          latest: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$latest" },
      },
    ]);

    res.json(latestPerUser);
  } catch (error) {
    console.error("Error in /rescuer/latest-all:", error);
    res.status(500).json({ error: "Failed to fetch rescuer data", details: error });
  }
});


app.get("/rescuer/sos", async (req, res) => {
  try {
    const sosUsers = await WearableData.aggregate([
      { $match: { sos: true } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$userId",
          latest: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$latest" } },
    ]);

    res.json(sosUsers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch SOS users", details: error });
  }
});

app.get("/alerts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const alerts = await WearableData.find({
      userId,
      $or: [
        { sos: true },
        { bpm: { $gt: 100 } },
        { bpm: { $lt: 50 } },
      ],
    }).sort({ timestamp: -1 });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});


app.post("/sos", async (req, res) => {
  try {
    const { userId, name, bpm, lat, lng } = req.body;

    const sosEntry = new WearableData({
      userId,
      name,
      bpm,
      lat,
      lng,
      sos: true,
    });

    await sosEntry.save();

    res.json({ status: "SOS_TRIGGERED", entry: sosEntry });
  } catch (error) {
    res.status(500).json({ error: "Failed to trigger SOS", details: error });
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Backend running on port", port));
