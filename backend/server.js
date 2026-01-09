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

// ------------------ AUTH (LOGIN) ------------------

// ------------------ AUTH (SIGNUP) ------------------

app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    res.status(200).json({
      userId: "device_" + Date.now(),
      name,
      role: "user",
      message: "Signup successful",
    });

  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});



// app.post("/auth/login", (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ error: "Email is required" });
//   }

//   // Hardcoded users for demo
//   if (email === "user@gmail.com" ) {
//     return res.json({
//       userId: "device_001",
//       name: "Sneha Singh",
//       role: "user",
//     });
//   }

//   if (email === "rescuer@gmail.com") {
//     return res.json({
//       userId: "rescuer_001",
//       name: "Rescue Officer",
//       role: "rescuer",
//     });
//   }

//   return res.status(401).json({ error: "Unauthorized user" });
// });

app.post("/auth/login", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Rescuer (special access)
  if (email === "rescuer@gmail.com") {
    return res.json({
      userId: "rescuer_001",
      name: "Rescue Officer",
      role: "rescuer",
    });
  }

  // Any other email = normal user
  return res.json({
    userId: "device_" + Date.now(),
    name: email.split("@")[0],   // auto name from email
    role: "user",
  });
});


app.post("/data", async (req, res) => {
  try {
    console.log("Incoming data from ESP32:", req.body);

    const { userId, name, bpm, spo2, lat, lng, sos } = req.body;


    const entry = new WearableData({
      userId,
      name,
      bpm,
      spo2,
      lat,
      lng,
      sos: !!sos,
    });
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

app.get("/latest6", async (req, res) => {
  try {
    const latestThree = await WearableData.find().sort({ timestamp: -1 }).limit(6);
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
        { bpm: { $lt: 60 } },
        { bpm: { $gt: 100 } },
        { spo2: { $lt: 92 } },
      ],
    }).sort({ timestamp: -1 });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});



app.post("/sos", async (req, res) => {
  try {
    const { userId, name, bpm, spo2, lat, lng } = req.body;


    const sosEntry = new WearableData({
  userId,
  name,
  bpm,
  spo2,     
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
