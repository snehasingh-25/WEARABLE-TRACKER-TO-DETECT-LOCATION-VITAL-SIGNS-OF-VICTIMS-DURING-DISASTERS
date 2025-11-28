const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ESP32 Backend Running!");
});

app.post("/data", (req, res) => {
  console.log("Incoming data from ESP32:", req.body);
  res.json({ status: "ok", received: req.body });
});

app.listen(3000, () => console.log("Backend running on port 3000"));
