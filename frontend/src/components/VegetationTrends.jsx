import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function VegetationTrends({
  analysis,
}) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showNdvi, setShowNdvi] = useState(true);
  const [showNdmi, setShowNdmi] = useState(true);

  const observations =
    analysis?.observations ?? [];

  const validObservations = observations.filter(
    (observation) =>
      observation.ndvi_mean !== null &&
      observation.ndvi_mean !== undefined &&
      observation.ndmi_mean !== null &&
      observation.ndmi_mean !== undefined,
  );

  if (validObservations.length < 2) {
    return (
      <div className="bg-white rounded-xl border border-border-gray p-5">
        <h3 className="text-[14px] font-semibold text-text-dark">
          Vegetation & Moisture Trends
        </h3>

        <p className="text-[12px] text-text-muted mt-2">
          Insufficient temporal observations for trend
          visualization.
        </p>
      </div>
    );
  }

  const svgWidth = 720;
  const svgHeight = 220;

  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth =
    svgWidth - paddingLeft - paddingRight;

  const chartHeight =
    svgHeight - paddingTop - paddingBottom;

  const yMin = -0.2;
  const yMax = 1;

  const getX = (index) =>
    paddingLeft +
    (index / (validObservations.length - 1)) *
      chartWidth;

  const getY = (value) => {
    const ratio =
      (value - yMin) / (yMax - yMin);

    return (
      svgHeight -
      paddingBottom -
      ratio * chartHeight
    );
  };

  const getPath = (key) =>
    validObservations.reduce(
      (path, observation, index) => {
        const x = getX(index);
        const y = getY(observation[key]);

        return index === 0
          ? `M ${x} ${y}`
          : `${path} L ${x} ${y}`;
      },
      "",
    );

  const handleMouseMove = (event) => {
    const rect =
      event.currentTarget.getBoundingClientRect();

    const mouseX =
      event.clientX - rect.left;

    const scaledX =
      (mouseX / rect.width) * svgWidth;

    const percentage =
      (scaledX - paddingLeft) / chartWidth;

    let index = Math.round(
      percentage *
        (validObservations.length - 1),
    );

    index = Math.max(
      0,
      Math.min(
        index,
        validObservations.length - 1,
      ),
    );

    setHoverIndex(index);
  };

  return (
    <div className="bg-white rounded-xl border border-border-gray shadow-[0px_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-[14px] font-semibold text-text-dark">
          Vegetation & Moisture Trends
        </h3>

        <p className="text-[12px] text-text-muted mt-0.5">
          Multi-temporal NDVI and NDMI from
          Sentinel-2 observations
        </p>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono">
        <button
          onClick={() =>
            setShowNdvi((value) => !value)
          }
          className={`flex items-center gap-2 px-2 py-1 rounded border ${
            showNdvi
              ? "border-primary-green bg-[#e2f4ea] text-primary-green font-semibold"
              : "border-border-gray text-[#717973]"
          }`}
        >
          {showNdvi ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}

          <span>NDVI</span>

          <span className="w-4 h-1 bg-[#2c694e] inline-block rounded" />
        </button>

        <button
          onClick={() =>
            setShowNdmi((value) => !value)
          }
          className={`flex items-center gap-2 px-2 py-1 rounded border ${
            showNdmi
              ? "border-blue-700 bg-blue-50 text-blue-700 font-semibold"
              : "border-border-gray text-[#717973]"
          }`}
        >
          {showNdmi ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}

          <span>NDMI</span>

          <span className="w-4 h-1 bg-blue-600 inline-block rounded" />
        </button>
      </div>

      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() =>
            setHoverIndex(null)
          }
        >
          {[1, 0.6, 0.2, -0.2].map(
            (value) => (
              <line
                key={value}
                x1={paddingLeft}
                y1={getY(value)}
                x2={svgWidth - paddingRight}
                y2={getY(value)}
                stroke="#eeeeec"
                strokeWidth="1"
              />
            ),
          )}

          <g className="text-[9px] fill-[#717973] font-mono">
            {[1, 0.6, 0.2, -0.2].map(
              (value) => (
                <text
                  key={value}
                  x={paddingLeft - 8}
                  y={getY(value) + 3}
                  textAnchor="end"
                >
                  {value.toFixed(1)}
                </text>
              ),
            )}
          </g>

          <g className="text-[9px] fill-[#717973] font-mono">
            {validObservations.map(
              (observation, index) => {
                if (
                  index % 2 !== 0 &&
                  index !==
                    validObservations.length - 1
                ) {
                  return null;
                }

                return (
                  <text
                    key={`${observation.date}-${index}`}
                    x={getX(index)}
                    y={svgHeight - 14}
                    textAnchor="middle"
                  >
                    {observation.date}
                  </text>
                );
              },
            )}
          </g>

          {showNdmi && (
            <path
              d={getPath("ndmi_mean")}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {showNdvi && (
            <path
              d={getPath("ndvi_mean")}
              fill="none"
              stroke="#2c694e"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {hoverIndex !== null && (
            <>
              <line
                x1={getX(hoverIndex)}
                y1={paddingTop}
                x2={getX(hoverIndex)}
                y2={
                  svgHeight - paddingBottom
                }
                stroke="#717973"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {showNdvi && (
                <circle
                  cx={getX(hoverIndex)}
                  cy={getY(
                    validObservations[
                      hoverIndex
                    ].ndvi_mean,
                  )}
                  r="4"
                  fill="#2c694e"
                  stroke="white"
                  strokeWidth="1.5"
                />
              )}

              {showNdmi && (
                <circle
                  cx={getX(hoverIndex)}
                  cy={getY(
                    validObservations[
                      hoverIndex
                    ].ndmi_mean,
                  )}
                  r="4"
                  fill="#2563eb"
                  stroke="white"
                  strokeWidth="1.5"
                />
              )}
            </>
          )}
        </svg>

        {hoverIndex !== null && (
          <div className="absolute top-3 right-3 bg-white border border-[#eeeeec] p-2.5 rounded-lg shadow-lg text-xs pointer-events-none z-20 w-40">
            <span className="font-mono font-bold text-text-dark">
              {
                validObservations[hoverIndex]
                  .date
              }
            </span>

            {showNdvi && (
              <div className="flex justify-between mt-2">
                <span className="text-text-muted">
                  NDVI
                </span>

                <span className="font-mono font-bold text-primary-green">
                  {validObservations[
                    hoverIndex
                  ].ndvi_mean.toFixed(3)}
                </span>
              </div>
            )}

            {showNdmi && (
              <div className="flex justify-between mt-1">
                <span className="text-text-muted">
                  NDMI
                </span>

                <span className="font-mono font-bold text-blue-600">
                  {validObservations[
                    hoverIndex
                  ].ndmi_mean.toFixed(3)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}