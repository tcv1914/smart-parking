const { getLatestState } = require("../services/mqttservice.js");

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Client connected");

    // gửi trạng thái hiện tại
    socket.emit("parking_update", getLatestState());

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected");
    });
  });
};

module.exports = initSocket;
