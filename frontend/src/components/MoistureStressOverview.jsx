export default function MoistureStressOverview() {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const healthyPercent = 0.78;
  const moderatePercent = 0.14;
  const highPercent = 0.08;

  const healthyStroke = circumference * healthyPercent;
  const moderateStroke = circumference * moderatePercent;
  const highStroke = circumference * highPercent;

  return (
    <div className="bg-white rounded-xl border border-border-gray shadow-[0px_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col justify-between h-[520px]">
      <div>
        <h3 className="text-[14px] font-semibold text-text-dark">
          Moisture Stress Overview
        </h3>

        <p className="text-[11px] text-text-muted mt-1">
          Field moisture condition distribution
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
              strokeDashoffset="0"
            />

            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#d97706"
              strokeWidth="14"
              strokeDasharray={`${moderateStroke} ${circumference}`}
              strokeDashoffset={-healthyStroke}
            />

            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#ba1a1a"
              strokeWidth="14"
              strokeDasharray={`${highStroke} ${circumference}`}
              strokeDashoffset={-(healthyStroke + moderateStroke)}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold font-mono text-text-dark tracking-tight leading-none">
              78%
            </span>

            <span className="text-[10px] font-mono font-bold text-primary-green mt-1 tracking-wider uppercase">
              HEALTHY
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-[#eeeeec] pt-4">
        <div className="flex justify-between items-center py-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2c694e]"></span>

            <span className="text-[13px] text-text-muted">Healthy</span>
          </div>

          <span className="text-[13px] font-mono font-bold text-text-dark">
            78%
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]"></span>

            <span className="text-[13px] text-text-muted">
              Moderate Stress
            </span>
          </div>

          <span className="text-[13px] font-mono font-bold text-text-dark">
            14%
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span>

            <span className="text-[13px] text-text-muted">High Stress</span>
          </div>

          <span className="text-[13px] font-mono font-bold text-text-dark">
            8%
          </span>
        </div>
      </div>

      <div className="mt-4 py-2.5 bg-[#f9f9f7] rounded-lg text-center">
        <span className="text-[12px] font-medium text-accent-red">
          1 field requires immediate attention
        </span>
      </div>
    </div>
  );
}