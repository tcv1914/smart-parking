export default function ParkingStatus({ data }) {
  const percent = (data.count / data.capacity) * 100;
  const available = data.capacity - data.count;
  const statusColor = percent > 90 ? "red" : percent > 70 ? "yellow" : "green";
  const statusText =
    percent > 90 ? "Đầy" : percent > 70 ? "Gần đầy" : "Còn trống";

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Thông tin chính */}
        <div>
          <h2 className="text-gray-600 text-lg font-semibold mb-4">
            Tình trạng bãi đỗ
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">Xe đang đỗ</p>
              <p className="text-4xl font-bold text-blue-600">{data.count}</p>
              <p className="text-gray-400 text-xs">/ {data.capacity} chỗ</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Chỗ còn trống</p>
              <p className="text-3xl font-bold text-green-600">{available}</p>
            </div>
          </div>
        </div>

        {/* Biểu đồ tròn */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Vòng nền */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              {/* Vòng tiến trình */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={
                  statusColor === "red"
                    ? "#ef4444"
                    : statusColor === "yellow"
                      ? "#eab308"
                      : "#22c55e"
                }
                strokeWidth="8"
                strokeDasharray={`${(percent / 100) * 282.7} 282.7`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
              {/* Text */}
              <text
                x="50"
                y="45"
                textAnchor="middle"
                className="text-2xl font-bold fill-gray-800"
                fontSize="16"
              >
                {Math.round(percent)}%
              </text>
              <text
                x="50"
                y="60"
                textAnchor="middle"
                className="fill-gray-500"
                fontSize="12"
              >
                {statusText}
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-600 font-semibold">Tỷ lệ sử dụng</p>
          <span className="text-sm font-bold text-blue-600">
            {Math.round(percent)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              statusColor === "red"
                ? "bg-red-500"
                : statusColor === "yellow"
                  ? "bg-yellow-500"
                  : "bg-green-500"
            }`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
