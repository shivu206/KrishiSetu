import { MapPin, Satellite } from "lucide-react";

export default function DashboardSatelliteMonitoring({
  fields,
  selectedFieldId,
  onSelectField,
}) {
  const selectedField =
    fields.find((field) => field.id === selectedFieldId) || fields[0];

  return (
    <div className="bg-white rounded-xl border border-border-gray shadow-[0px_1px_3px_rgba(0,0,0,0.05)] flex flex-col h-[520px] overflow-hidden">
      <div className="relative flex-1 bg-[#e9eee9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto shadow-sm border border-[#eeeeec]">
            <Satellite className="w-6 h-6 text-primary-green" />
          </div>

          <h3 className="text-[15px] font-bold text-primary-green mt-4">
            Satellite Field Monitoring
          </h3>

          <p className="text-[12px] text-text-muted mt-1">
            Sentinel-1 and Sentinel-2 field visualization
          </p>

          <div className="flex items-center justify-center gap-2 mt-5">
            {fields.map((field) => (
              <button
                key={field.id}
                onClick={() => onSelectField(field.id)}
                className={`px-3 py-2 rounded-lg text-[12px] font-semibold border transition-colors ${
                  selectedFieldId === field.id
                    ? "bg-primary-green text-white border-primary-green"
                    : "bg-white text-text-muted border-[#eeeeec]"
                }`}
              >
                {field.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#f9f9f7] px-5 py-3 border-t border-[#eeeeec] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#717973]" />

          <div>
            <span className="text-[13px] font-semibold text-text-dark">
              {selectedField.name}
            </span>

            <span className="text-[11px] text-text-muted ml-2">
              • Crop:{" "}
              <strong className="font-semibold text-text-dark">
                {selectedField.cropType}
              </strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[12px] font-mono">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-text-muted leading-none">
              TOTAL AREA
            </span>

            <span className="text-text-dark font-bold mt-1">
              {selectedField.areaHa} ha
            </span>
          </div>

          <div className="w-px h-8 bg-[#eeeeec]"></div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] text-text-muted leading-none">
              MOISTURE LEVEL
            </span>

            <span
              className={`font-bold mt-1 ${
                selectedField.status === "Healthy"
                  ? "text-primary-green"
                  : selectedField.status === "Moderate"
                    ? "text-accent-amber"
                    : "text-accent-red"
              }`}
            >
              {selectedField.moistureLevel}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}