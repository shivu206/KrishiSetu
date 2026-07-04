import { Cloud, Layers, Radio } from "lucide-react";
import { recentSatellitePasses } from "../constants/dashboardData";

export default function RecentSatelliteAnalysis() {
  return (
    <div className="bg-white rounded-xl border border-border-gray shadow-[0px_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col h-full min-h-[400px]">
      <div className="mb-4">
        <h3 className="text-[14px] font-semibold text-text-dark">
          Recent Satellite Analysis
        </h3>

        <p className="text-[12px] text-text-muted mt-0.5">
          Latest Sentinel-1 and Sentinel-2 processing results
        </p>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex flex-col gap-3">
          {recentSatellitePasses.map((pass, index) => {
            const isSentinel1 = pass.sensor === "SENTINEL-1";

            return (
              <div
                key={`${pass.sensor}-${pass.date}-${index}`}
                className="flex items-center justify-between p-3.5 bg-[#f9f9f7] rounded-lg border border-[#eeeeec] hover:border-text-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-primary-green">
                    {isSentinel1 ? (
                      <Radio className="w-4 h-4" />
                    ) : (
                      <Layers className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-text-dark font-mono">
                        {pass.sensor}
                      </span>

                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold uppercase bg-[#e2f4ea] text-primary-green">
                        {pass.status}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-text-muted mt-1 block">
                      Analysis date: {pass.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-[12px] font-mono">
                  {isSentinel1 ? (
                    <>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-text-muted leading-none">
                          POLARIZATION
                        </span>

                        <span className="font-bold mt-1.5 text-text-dark">
                          {pass.polarization}
                        </span>
                      </div>

                      <div className="w-px h-8 bg-[#eeeeec]"></div>

                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-text-muted leading-none">
                          DATA TYPE
                        </span>

                        <span className="font-bold mt-1.5 text-text-dark">
                          SAR
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-text-muted leading-none">
                          CLOUD COVER
                        </span>

                        <span className="font-bold mt-1.5 flex items-center gap-1 text-primary-green">
                          <Cloud className="w-3.5 h-3.5 shrink-0" />

                          {pass.cloudCover.toFixed(1)}%
                        </span>
                      </div>

                      <div className="w-px h-8 bg-[#eeeeec]"></div>

                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-text-muted leading-none">
                          AVG NDVI
                        </span>

                        <span className="font-bold mt-1.5 text-text-dark">
                          {pass.ndviAverage.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}