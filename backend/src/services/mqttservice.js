const mqtt = require("mqtt");
const Event = require("../models/Event.js");

let ioRef = null;
let latestState = null;

const startMQTT = (io) => {
  ioRef = io;

  const client = mqtt.connect(process.env.MQTT_URL, {
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,
  });

  client.on("connect", () => {
    console.log("✅ MQTT connected");
    client.subscribe("parking/state");
  });

  client.on("message", async (topic, message) => {
    try {
      const data = JSON.parse(message.toString());

      console.log("📩", data);

      latestState = data;

      // lưu DB
      await Event.create(data);

      // gửi realtime
      if (ioRef) {
        ioRef.emit("parking_update", data);
      }
    } catch (err) {
      console.error("❌ MQTT error:", err);
    }
  });
};

const getLatestState = () =>
  latestState || {
    count: 0,
    capacity: 10,
    full: false,
    gate: "close",
    event: "init",
  };

module.exports = { startMQTT, getLatestState };
