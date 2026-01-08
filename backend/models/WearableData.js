const mongoose = require("mongoose");


const WearableDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  bpm: {
    type: Number,
    required: true,
  },
  spo2: {
    type: Number,
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
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

WearableDataSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model("WearableData", WearableDataSchema);
