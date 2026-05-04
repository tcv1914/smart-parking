import { useEffect, useState } from "react";
import axios from "axios";

export default function EventHistory() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/history")
      .then((res) => setEvents(res.data))
      .catch(() => {});
  }, []);

  const getEventIcon = (event) => {
    return event === "car_in" ? "📥" : "📤";
  };

  const getEventLabel = (event) => {
    return event === "car_in" ? "Xe vào" : "Xe ra";
  };

  const getEventColor = (event) => {
    return event === "car_in"
      ? "bg-green-50 border-green-200"
      : "bg-orange-50 border-orange-200";
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        📋 Lịch sử gần đây
      </h3>

      {events.length === 0 ? (
        <p className="text-gray-400 text-center py-4">Chưa có sự kiện</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {events.map((event, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-l-4 transition-all ${getEventColor(
                event.event,
              )} ${
                event.event === "car_in"
                  ? "border-l-green-500"
                  : "border-l-orange-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getEventIcon(event.event)}</span>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {getEventLabel(event.event)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(event.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-700">{event.count}</p>
                  <p className="text-xs text-gray-500">/ {event.capacity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
