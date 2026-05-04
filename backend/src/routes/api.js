const express = require("express");
const Event = require("../models/Event.js");
const { getLatestState } = require("../services/mqttservice.js");

const router = express.Router();

// trạng thái hiện tại
router.get("/state", (req, res) => {
  res.json(getLatestState());
});

// lịch sử
router.get("/history", async (req, res) => {
  const data = await Event.find().sort({ createdAt: -1 }).limit(50);

  res.json(data);
});

// thống kê
router.get("/stats", async (req, res) => {
  const totalIn = await Event.countDocuments({ event: "car_in" });
  const totalOut = await Event.countDocuments({ event: "car_out" });

  res.json({ totalIn, totalOut });
});

module.exports = router;
