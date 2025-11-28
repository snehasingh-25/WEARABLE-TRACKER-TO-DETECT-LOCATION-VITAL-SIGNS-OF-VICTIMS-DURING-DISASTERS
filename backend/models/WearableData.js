const mongoose = require("mongoose");

const WearableDataSchema = new mongoose.Schema({
  bpm: { type: Number, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  sos: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("WearableData", WearableDataSchema);
