import {
  Calendar,
  Droplet,
  CloudRain,
  Gauge,
} from "lucide-react";

export default function IrrigationAdvisory({
  analysis,
}) {
  const water =
    analysis.water_deficit_analysis;

  const weather = analysis.weather_analysis;

  const priority =
    water?.irrigation_priority ?? "unknown";

  const getPriorityStyle = () => {
    if (
    priority === "urgent" ||
    priority === "high"
    ) {
    return "bg-red-50 text-accent-red";
    }

    if (priority === "moderate") {
    return "bg-amber-50 text-accent-amber";
    }

    if (priority === "low") {
    return "bg-[#e2f4ea] text-primary-green";
    }

    return "bg-gray-100 text-text-muted";
  };

  return (
    <div className="bg-white rounded-xl border border-border-gray shadow-[0px_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col h-full min-h-[400px]">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-[14px] font-semibold text-text-dark">
            8-Day Irrigation Advisory
          </h3>

          <p className="text-[12px] text-text-muted mt-0.5">
              Satellite and weather-informed crop water
              deficit estimation
          </p>
        </div>

        <Droplet className="w-5 h-5 text-blue-600" />
      </div>

      <div className="flex items-center justify-between p-4 bg-[#f9f9f7] rounded-xl border border-[#eeeeec]">
        <div>
          <span className="text-[11px] font-mono uppercase text-text-muted">
            Estimated Water Deficit
          </span>

          <div className="mt-1">
            <span className="text-3xl font-bold font-mono text-text-dark">
              {water?.water_deficit_mm?.toFixed(
                1,
              ) ?? "N/A"}
            </span>

            <span className="text-[13px] text-text-muted ml-1">
              mm
            </span>
          </div>
        </div>

        <span
  className={`inline-flex text-[11px] font-semibold px-3 py-1.5 rounded-full uppercase ${getPriorityStyle()}`}
>
  {priority === "unknown"
    ? "Priority Unavailable"
    : `${priority} priority`}
</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="border border-[#eeeeec] rounded-lg p-3">
          <Gauge className="w-4 h-4 text-text-muted" />

          <span className="block text-[10px] uppercase font-mono text-text-muted mt-2">
            Crop Demand
          </span>

          <span className="text-[15px] font-bold font-mono text-text-dark">
            {water?.crop_water_demand_mm?.toFixed(
              1,
            ) ?? "N/A"}{" "}
            mm
          </span>
        </div>

        <div className="border border-[#eeeeec] rounded-lg p-3">
          <CloudRain className="w-4 h-4 text-blue-600" />

          <span className="block text-[10px] uppercase font-mono text-text-muted mt-2">
            Rainfall
          </span>

          <span className="text-[15px] font-bold font-mono text-text-dark">
            {weather?.rainfall_mm_8day?.toFixed(
              1,
            ) ?? "N/A"}{" "}
            mm
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-[#eeeeec] pt-4 flex flex-col gap-3 text-[12px]">
        <div className="flex justify-between">
          <span className="text-text-muted">
            Reference ET₀
          </span>

          <span className="font-mono font-bold">
            {weather?.reference_et_mm_8day?.toFixed(
              2,
            ) ?? "N/A"}{" "}
            mm
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-text-muted">
            Crop Coefficient
          </span>

          <span className="font-mono font-bold">
            {water?.crop_coefficient?.toFixed(
              2,
            ) ?? "N/A"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-text-muted">
            Advisory
          </span>

          <span className="font-semibold text-primary-green">
            {water?.irrigation_status
              ?.replaceAll("_", " ")
              .toUpperCase() ?? "UNAVAILABLE"}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <div className="flex items-center gap-2 py-2.5 px-3 bg-blue-50 rounded-lg text-[11px] text-blue-700">
          <Calendar className="w-3.5 h-3.5 shrink-0" />

          Analysis period:{" "}
          {weather?.start_date ?? "N/A"} to{" "}
          {weather?.end_date ?? "N/A"}
        </div>
      </div>
    </div>
  );
}