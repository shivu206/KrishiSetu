import { Calendar, Droplet } from "lucide-react";

const irrigationAdvisories = [
  {
    fieldId: "Field A-02",
    crop: "Mustard",
    moistureLevel: 28,
    recommendation: "Irrigate 25 mm",
    priority: "High",
    timeframe: "Within 12 hours",
  },
  {
    fieldId: "Field B-01",
    crop: "Barley",
    moistureLevel: 49,
    recommendation: "Irrigate 12 mm",
    priority: "Medium",
    timeframe: "Within 36 hours",
  },
  {
    fieldId: "Field A-01",
    crop: "Wheat",
    moistureLevel: 78,
    recommendation: "Continue monitoring",
    priority: "Low",
    timeframe: "Next analysis cycle",
  },
];

export default function IrrigationAdvisory() {
  const getPriorityStyle = (priority) => {
    if (priority === "High") {
      return "bg-red-50 text-accent-red";
    }

    if (priority === "Medium") {
      return "bg-amber-50 text-accent-amber";
    }

    return "bg-[#e2f4ea] text-primary-green";
  };

  return (
    <div className="bg-white rounded-xl border border-border-gray shadow-[0px_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col h-full min-h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-text-dark">
            Irrigation Advisory
          </h3>

          <p className="text-[12px] text-text-muted mt-0.5">
            Irrigation recommendations from crop and moisture analysis
          </p>
        </div>

        <Droplet className="w-5 h-5 text-blue-600" />
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#eeeeec] text-[10px] font-mono font-bold text-text-muted uppercase">
              <th className="py-2.5">Field / Crop</th>
              <th className="py-2.5 text-center">Moisture</th>
              <th className="py-2.5">Recommendation</th>
              <th className="py-2.5">Timeframe</th>
              <th className="py-2.5 text-right">Priority</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#eeeeec]">
            {irrigationAdvisories.map((item) => (
              <tr
                key={item.fieldId}
                className="hover:bg-[#f9f9f7] transition-colors"
              >
                <td className="py-3">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-text-dark">
                      {item.fieldId}
                    </span>

                    <span className="text-[11px] text-[#717973]">
                      {item.crop}
                    </span>
                  </div>
                </td>

                <td className="py-3 text-center">
                  <div className="flex flex-col items-center">
                    <span
                      className={`text-[12px] font-mono font-bold ${
                        item.moistureLevel < 35
                          ? "text-accent-red"
                          : item.moistureLevel < 60
                            ? "text-accent-amber"
                            : "text-primary-green"
                      }`}
                    >
                      {item.moistureLevel}%
                    </span>

                    <div className="w-12 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.moistureLevel < 35
                            ? "bg-accent-red"
                            : item.moistureLevel < 60
                              ? "bg-accent-amber"
                              : "bg-[#2c694e]"
                        }`}
                        style={{ width: `${item.moistureLevel}%` }}
                      />
                    </div>
                  </div>
                </td>

                <td className="py-3 text-[12px] text-text-dark font-medium">
                  {item.recommendation}
                </td>

                <td className="py-3 text-[12px] text-text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#717973]" />

                    {item.timeframe}
                  </span>
                </td>

                <td className="py-3 text-right">
                  <span
                    className={`inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full ${getPriorityStyle(
                      item.priority,
                    )}`}
                  >
                    {item.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}