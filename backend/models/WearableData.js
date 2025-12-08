const mongoose = require("mongoose");

const WearableDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,         // e.g. "device_001" or user ID from auth
  },
  name: {
    type: String,
    required: true,         // e.g. "Sneha Singh"
  },
  bpm: {
    type: Number,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  sos: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

WearableDataSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model("WearableData", WearableDataSchema);
