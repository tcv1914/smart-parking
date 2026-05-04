import { useEffect, useState } from "react";
import axios from "axios";

export default function Statistics() {
  const [stats, setStats] = useState({ totalIn: 0, totalOut: 0 });

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/stats")
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      {/* Xe vào */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-2">
              Xe vào hôm nay
            </p>
            <p className="text-3xl font-bold text-green-600">{stats.totalIn}</p>
          </div>
          <div className="text-4xl">📥</div>
        </div>
      </div>

      {/* Xe ra */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-2">
              Xe ra hôm nay
            </p>
            <p className="text-3xl font-bold text-orange-600">
              {stats.totalOut}
            </p>
          </div>
          <div className="text-4xl">📤</div>
        </div>
      </div>
    </div>
  );
}
