export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🅿️</div>
          <div>
            <h1 className="text-2xl font-bold">Smart Parking System</h1>
            <p className="text-blue-100 text-sm">
              Quản lý bãi đỗ xe thông minh
            </p>
          </div>
        </div>
        <div className="text-right text-blue-100">
          <p className="text-sm">Trạng thái hệ thống</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold">Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
