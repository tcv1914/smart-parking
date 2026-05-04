const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    event: String,
    count: Number,
    capacity: Number,
    full: Boolean,
    gate: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
