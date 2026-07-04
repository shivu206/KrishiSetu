import {
  LayoutGrid,
  Map,
  Sprout,
  Droplets,
  CalendarCheck,
  History,
  FileText,
  Settings,
  HelpCircle,
  Compass,
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "my-fields", label: "My Fields", icon: Map },
    { id: "crop-monitoring", label: "Crop Monitoring", icon: Sprout },
    { id: "moisture-stress", label: "Moisture Stress", icon: Droplets },
    {
      id: "irrigation-advisory",
      label: "Irrigation Advisory",
      icon: CalendarCheck,
    },
    { id: "analysis-history", label: "Analysis History", icon: History },
    { id: "reports", label: "Reports", icon: FileText },
  ];

  const bottomItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help", icon: HelpCircle },
  ];

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-[#eeeeec] flex flex-col justify-between py-6 px-4 shrink-0 overflow-y-auto">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 bg-primary-green text-white rounded-md flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-primary-green tracking-tight leading-none">
              KrishiSetu
            </h1>

            <span className="text-[10px] font-mono font-medium text-text-muted mt-1 uppercase tracking-wider">
              Satellite Crop Intelligence
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative w-full text-left py-2.5 px-3 rounded-lg text-[14px] font-medium flex items-center gap-3 transition-colors group ${
                  isActive
                    ? "text-primary-green font-semibold bg-[#f4f4f2]"
                    : "text-text-muted hover:text-text-dark hover:bg-[#f9f9f7]"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-green rounded-r" />
                )}

                <Icon
                  className={`w-[18px] h-[18px] shrink-0 ${
                    isActive
                      ? "text-primary-green"
                      : "text-[#717973] group-hover:text-text-dark"
                  }`}
                />

                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <div className="border-t border-[#eeeeec] pt-4 flex flex-col gap-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left py-2 px-3 rounded-lg text-[14px] font-medium flex items-center gap-3 transition-colors ${
                  isActive
                    ? "text-primary-green font-semibold bg-[#f4f4f2]"
                    : "text-text-muted hover:text-text-dark hover:bg-[#f9f9f7]"
                }`}
              >
                <Icon className="w-[18px] h-[18px] text-[#717973]" />

                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 p-2 bg-[#f9f9f7] rounded-lg border border-[#eeeeec]">
          <div className="w-9 h-9 rounded-full bg-[#dce9df] flex items-center justify-center text-primary-green font-bold text-[14px] shrink-0">
            S
          </div>

          <span className="text-[14px] font-semibold text-text-dark truncate">
            Shivansh Awasthi
          </span>
        </div>
      </div>
    </aside>
  );
}