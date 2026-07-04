import {
  LayoutGrid,
  TrendingUp,
  AlertTriangle,
  Clock,
  HelpCircle,
} from "lucide-react";

const icons = {
  LayoutGrid,
  TrendingUp,
  AlertTriangle,
  Clock,
};

export default function MetricCard({
  title,
  value,
  subtext,
  iconName,
  badge,
  alert,
}) {
  const Icon = icons[iconName] || HelpCircle;

  return (
    <div
      className={`bg-white rounded-xl border p-5 flex flex-col justify-between shadow-[0px_1px_3px_rgba(0,0,0,0.05)] relative overflow-hidden h-[120px] ${
        alert
          ? "border-l-4 border-l-accent-red border-y-border-gray border-r-border-gray"
          : "border-border-gray"
      }`}
    >
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-mono tracking-wider text-text-muted font-bold uppercase">
          {title}
        </span>

        <div
          className={`p-1.5 rounded-lg ${
            alert
              ? "bg-red-50 text-accent-red"
              : "bg-gray-50 text-text-muted"
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-end justify-between mt-2">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold font-mono tracking-tight leading-none ${
                alert ? "text-accent-red" : "text-text-dark"
              }`}
            >
              {value}
            </span>

            {badge && (
              <span className="bg-[#e2f4ea] text-primary-green font-mono text-[10px] px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" />
                {badge}
              </span>
            )}
          </div>

          <span className="text-[12px] text-text-muted mt-1 font-medium">
            {subtext}
          </span>
        </div>
      </div>
    </div>
  );
}