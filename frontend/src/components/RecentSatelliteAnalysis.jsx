import {
  Layers,
  Radio,
} from "lucide-react";

export default function RecentSatelliteAnalysis({
  analysis,
}) {
  const observations = [
    ...(analysis?.observations ?? []),
  ]
    .reverse()
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-border-gray shadow-[0px_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col h-full min-h-[400px]">
      <div className="mb-4">
        <h3 className="text-[14px] font-semibold text-text-dark">
          Recent Satellite Analysis
        </h3>

        <p className="text-[12px] text-text-muted mt-0.5">
          Latest fused Sentinel-1 and Sentinel-2
          observations
        </p>
      </div>

      <div className="flex-1">
        <div className="flex flex-col gap-3">
          {observations.map(
            (observation, index) => (
              <div
                key={`${observation.date}-${index}`}
                className="flex items-center justify-between p-3.5 bg-[#f9f9f7] rounded-lg border border-[#eeeeec]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-primary-green">
                    <Layers className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-text-dark font-mono">
                        SENTINEL-2
                      </span>

                      {observation.radar_available && (
                        <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold uppercase bg-blue-50 text-blue-700">
                          <Radio className="w-3 h-3" />
                          S1 FUSED
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-text-muted mt-1 block">
                      {observation.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-5 text-[12px] font-mono">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-text-muted">
                      NDVI
                    </span>

                    <span className="font-bold mt-1 text-primary-green">
                      {observation.ndvi_mean?.toFixed(
                        3,
                      ) ?? "N/A"}
                    </span>
                  </div>

                  <div className="w-px h-8 bg-[#eeeeec]" />

                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-text-muted">
                      NDMI
                    </span>

                    <span className="font-bold mt-1 text-blue-600">
                      {observation.ndmi_mean?.toFixed(
                        3,
                      ) ?? "N/A"}
                    </span>
                  </div>

                  <div className="w-px h-8 bg-[#eeeeec]" />

                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-text-muted">
                      VALID PIXELS
                    </span>

                    <span className="font-bold mt-1 text-text-dark">
                      {observation
                        .sentinel2_valid_pixels ??
                        "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="border-t border-[#eeeeec] mt-4 pt-3 flex justify-between text-[11px] text-text-muted">
        <span>
          {analysis?.observation_count ?? 0} optical
          observations
        </span>

        <span>
          {analysis?.radar_supported_count ?? 0} radar
          supported
        </span>
      </div>
    </div>
  );
}