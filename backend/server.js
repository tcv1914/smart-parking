require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");
const connectDB = require("./src/config/db");
const { startMQTT } = require("./src/services/mqttservice");
const initSocket = require("./src/soket/soket");

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// connect DB
connectDB();

// socket
initSocket(io);

// MQTT
startMQTT(io);

// start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
