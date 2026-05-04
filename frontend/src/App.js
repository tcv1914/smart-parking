import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import Header from "./components/Header";
import ParkingStatus from "./components/ParkingStatus";
import Statistics from "./components/Statistics";
import EventHistory from "./components/EventHistory";

const socket = io("http://localhost:8080");

function App() {
  const [data, setData] = useState({
    count: 0,
    capacity: 10,
    full: false,
    gate: "close",
    event: "init",
  });

  // lấy state ban đầu
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/state")
      .then((res) => setData(res.data))
      .catch(() => {});
  }, []);

  // realtime
  useEffect(() => {
    socket.on("parking_update", (msg) => {
      setData(msg);
    });

    return () => socket.off("parking_update");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tính trạng bãi đỗ - Dashboard chính */}
        <ParkingStatus data={data} />

        {/* Thống kê */}
        <Statistics />

        {/* Lịch sử sự kiện */}
        <EventHistory />

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm py-4 border-t">
          <p>© 2026 Smart Parking System. Tất cả quyền được bảo lưu.</p>
        </div>
      </main>
    </div>
  );
}

export default App;
