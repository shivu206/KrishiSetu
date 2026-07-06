export default function MoistureStressOverview({
  analysis,
}) {
  const stress =
    analysis.moisture_stress_analysis;

  const stressLevel =
    stress?.stress_level ?? "unknown";

  const stressScore = stress?.stress_score ?? 0;

  const scorePercent = Math.min(
    (stressScore / 7) * 100,
    100,
  );

  const healthyPercent = Math.max(
    100 - scorePercent,
    0,
  );

  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const healthyStroke =
    circumference * (healthyPercent / 100);

  const stressStroke =
    circumference * (scorePercent / 100);

  const stressColor =
    stressLevel === "high"
      ? "#ba1a1a"
      : stressLevel === "moderate"
        ? "#d97706"
        : "#2c694e";

  return (
    <div className="bg-white rounded-xl border border-border-gray shadow-[0px_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col justify-between h-[420px]">
      <div>
        <h3 className="text-[14px] font-semibold text-text-dark">
          Moisture Stress Overview
        </h3>

        <p className="text-[11px] text-text-muted mt-1">
          Multi-temporal NDMI, NDVI and SAR stress
          evidence
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center py-4">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#eeeeec"
              strokeWidth="14"
            />

            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#2c694e"
              strokeWidth="14"
              strokeDasharray={`${healthyStroke} ${circumference}`}
            />

            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke={stressColor}
              strokeWidth="14"
              strokeDasharray={`${stressStroke} ${circumference}`}
              strokeDashoffset={-healthyStroke}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold font-mono text-text-dark">
              {stressScore}
            </span>

            <span className="text-[10px] font-mono font-bold uppercase mt-1">
              STRESS SCORE
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#eeeeec] pt-4 flex flex-col gap-2 text-[12px]">
        <div className="flex justify-between">
          <span className="text-text-muted">
            Stress Level
          </span>

          <span className="font-mono font-bold uppercase">
            {stressLevel}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-text-muted">
            Current NDMI
          </span>

          <span className="font-mono font-bold">
            {stress?.current_ndmi?.toFixed(3) ??
              "N/A"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-text-muted">
            SAR Supported
          </span>

          <span className="font-mono font-bold">
            {stress?.radar_supported
              ? "YES"
              : "NO"}
          </span>
        </div>
      </div>
    </div>
  );
}