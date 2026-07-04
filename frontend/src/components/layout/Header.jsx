import { useState } from "react";
import { Search, Bell } from "lucide-react";

export default function Header({ onSearchChange, onNotificationClick }) {
  const [searchValue, setSearchValue] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearchValue(value);

    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <header className="h-[64px] bg-white border-b border-[#eeeeec] flex items-center justify-between px-6 sticky top-0 z-40 shrink-0">
      <div className="flex items-center w-full max-w-md relative">
        <Search className="absolute left-3 w-4 h-4 text-[#717973] pointer-events-none" />

        <input
          type="text"
          value={searchValue}
          onChange={handleSearch}
          placeholder="Search fields or crop data"
          className="w-full bg-white text-text-dark pl-10 pr-4 py-2 text-[14px] rounded-lg border border-[#eeeeec] focus:outline-none focus:ring-1 focus:ring-secondary-green focus:border-secondary-green placeholder-[#717973] transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#f4f4f2] border border-[#eeeeec] px-3 py-1.5 rounded-full select-none shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
          </span>

          <span className="text-[10px] md:text-[11px] font-mono font-bold text-text-dark tracking-wider">
            SATELLITE DATA ACTIVE
          </span>
        </div>

        <div className="h-6 w-px bg-[#eeeeec]"></div>

        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications((currentValue) => !currentValue);

              if (onNotificationClick) {
                onNotificationClick();
              }
            }}
            className="p-2 text-text-muted hover:text-text-dark hover:bg-[#f9f9f7] rounded-lg transition-colors relative"
            id="notification-bell-btn"
          >
            <Bell className="w-5 h-5" />

            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-red rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#eeeeec] rounded-xl shadow-lg py-2 z-50 text-text-dark">
              <div className="px-4 py-2 border-b border-[#eeeeec] flex justify-between items-center">
                <span className="font-semibold text-[14px]">
                  Notifications
                </span>

                <span className="text-[11px] font-mono text-[#10b981] font-bold">
                  Recent
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-[#f9f9f7] border-b border-[#eeeeec] transition-colors cursor-pointer">
                  <div className="flex justify-between">
                    <span className="text-[12px] font-semibold text-accent-red">
                      Moisture Alert
                    </span>

                    <span className="text-[10px] text-[#717973] font-mono">
                      2m ago
                    </span>
                  </div>

                  <p className="text-[12px] text-text-muted mt-1">
                    Field A-02 moisture level dropped below the 30% threshold.
                  </p>
                </div>

                <div className="px-4 py-3 hover:bg-[#f9f9f7] border-b border-[#eeeeec] transition-colors cursor-pointer">
                  <div className="flex justify-between">
                    <span className="text-[12px] font-semibold text-primary-green">
                      Sentinel-2 Analysis
                    </span>

                    <span className="text-[10px] text-[#717973] font-mono">
                      1h ago
                    </span>
                  </div>

                  <p className="text-[12px] text-text-muted mt-1">
                    Latest Sentinel-2 imagery analysis completed and NDVI data
                    updated.
                  </p>
                </div>

                <div className="px-4 py-3 hover:bg-[#f9f9f7] transition-colors cursor-pointer">
                  <div className="flex justify-between">
                    <span className="text-[12px] font-semibold text-accent-amber">
                      Irrigation Advisory
                    </span>

                    <span className="text-[10px] text-[#717973] font-mono">
                      4h ago
                    </span>
                  </div>

                  <p className="text-[12px] text-text-muted mt-1">
                    Irrigation is recommended for two moisture-stressed fields
                    within the next 48 hours.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}