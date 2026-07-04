import { useState, useRef, useEffect } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

export default function VegetationTrends({
  fields,
  selectedFieldId,
  onSelectField,
}) {
  const [activeFieldId, setActiveFieldId] = useState(selectedFieldId);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [showNdvi, setShowNdvi] = useState(true);
  const [showNdwi, setShowNdwi] = useState(true);

  const containerRef = useRef(null);

  useEffect(() => {
    setActiveFieldId(selectedFieldId);
  }, [selectedFieldId]);

  const activeField =
    fields.find((field) => field.id === activeFieldId) || fields[0];

  const handleFieldChange = (id) => {
    setActiveFieldId(id);
    onSelectField(id);
    setShowDropdown(false);
  };

  const svgWidth = 720;
  const svgHeight = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const yMin = -0.2;
  const yMax = 1;

  const getX = (index) =>
    paddingLeft +
    (index / (activeField.ndviTrend.length - 1)) * chartWidth;

  const getY = (value) => {
    const ratio = (value - yMin) / (yMax - yMin);

    return svgHeight - paddingBottom - ratio * chartHeight;
  };

  const getPath = (trend) =>
    trend.reduce((path, value, index) => {
      const x = getX(index);
      const y = getY(value);

      return index === 0 ? `M ${x} ${y}` : `${path} L ${x} ${y}`;
    }, "");

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;

    const scaledX = (mouseX / rect.width) * svgWidth;
    const percentage = (scaledX - paddingLeft) / chartWidth;

    let index = Math.round(
      percentage * (activeField.ndviTrend.length - 1),
    );

    index = Math.max(
      0,
      Math.min(index, activeField.ndviTrend.length - 1),
    );

    setHoverIndex(index);

    setHoverPos({
      x: getX(index),
      y: getY(activeField.ndviTrend[index]),
    });
  };

  return (
    <div className="bg-white rounded-xl border border-border-gray shadow-[0px_1px_3px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h3 className="text-[14px] font-semibold text-text-dark">
            Vegetation & Moisture Trends
          </h3>

          <p className="text-[12px] text-text-muted mt-0.5">
            NDVI and NDWI analysis from Sentinel-2 imagery
          </p>
        </div>

        <div className="relative self-stretch md:self-auto">
          <button
            onClick={() => setShowDropdown((value) => !value)}
            className="w-full md:w-56 bg-white border border-[#eeeeec] rounded-lg px-3 py-2 text-[13px] font-medium flex items-center justify-between hover:bg-[#f9f9f7] transition-colors shadow-sm"
          >
            <span className="truncate">{activeField.name}</span>

            <ChevronDown className="w-4 h-4 text-[#717973] ml-2 shrink-0" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-1 w-full md:w-56 bg-white border border-[#eeeeec] rounded-lg shadow-lg py-1 z-30">
              {fields.map((field) => (
                <button
                  key={field.id}
                  onClick={() => handleFieldChange(field.id)}
                  className={`w-full text-left px-3 py-2 text-[13px] transition-colors flex items-center justify-between ${
                    field.id === activeFieldId
                      ? "bg-[#f4f4f2] text-primary-green font-semibold"
                      : "text-text-muted hover:bg-[#f9f9f7]"
                  }`}
                >
                  <span className="truncate">{field.name}</span>

                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: field.color }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono">
        <button
          onClick={() => setShowNdvi((value) => !value)}
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
          onClick={() => setShowNdwi((value) => !value)}
          className={`flex items-center gap-2 px-2 py-1 rounded border ${
            showNdwi
              ? "border-blue-700 bg-blue-50 text-blue-700 font-semibold"
              : "border-border-gray text-[#717973]"
          }`}
        >
          {showNdwi ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}

          <span>NDWI</span>

          <span className="w-4 h-1 bg-blue-600 inline-block rounded" />
        </button>
      </div>

      <div className="relative w-full" ref={containerRef}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {[1, 0.6, 0.2, -0.2].map((value) => (
            <line
              key={value}
              x1={paddingLeft}
              y1={getY(value)}
              x2={svgWidth - paddingRight}
              y2={getY(value)}
              stroke="#eeeeec"
              strokeWidth="1"
            />
          ))}

          <g className="text-[9px] fill-[#717973] font-mono">
            {[1, 0.6, 0.2, -0.2].map((value) => (
              <text
                key={value}
                x={paddingLeft - 8}
                y={getY(value) + 3}
                textAnchor="end"
              >
                {value.toFixed(1)}
              </text>
            ))}
          </g>

          <g className="text-[9px] fill-[#717973] font-mono">
            {activeField.dates.map((date, index) => {
              if (index % 3 !== 0) {
                return null;
              }

              return (
                <text
                  key={date}
                  x={getX(index)}
                  y={svgHeight - 12}
                  textAnchor="middle"
                >
                  {date}
                </text>
              );
            })}
          </g>

          {showNdwi && (
            <path
              d={getPath(activeField.ndwiTrend)}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {showNdvi && (
            <path
              d={getPath(activeField.ndviTrend)}
              fill="none"
              stroke="#2c694e"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {hoverIndex !== null && (
            <>
              <line
                x1={hoverPos.x}
                y1={paddingTop}
                x2={hoverPos.x}
                y2={svgHeight - paddingBottom}
                stroke="#717973"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {showNdvi && (
                <circle
                  cx={hoverPos.x}
                  cy={getY(activeField.ndviTrend[hoverIndex])}
                  r="4"
                  fill="#2c694e"
                  stroke="white"
                  strokeWidth="1.5"
                />
              )}

              {showNdwi && (
                <circle
                  cx={hoverPos.x}
                  cy={getY(activeField.ndwiTrend[hoverIndex])}
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
          <div className="absolute top-3 right-3 bg-white border border-[#eeeeec] p-2.5 rounded-lg shadow-lg text-xs pointer-events-none z-20 w-36">
            <span className="font-mono font-bold text-text-dark">
              {activeField.dates[hoverIndex]}
            </span>

            {showNdvi && (
              <div className="flex justify-between mt-2">
                <span className="text-text-muted">NDVI</span>

                <span className="font-mono font-bold text-primary-green">
                  {activeField.ndviTrend[hoverIndex].toFixed(2)}
                </span>
              </div>
            )}

            {showNdwi && (
              <div className="flex justify-between mt-1">
                <span className="text-text-muted">NDWI</span>

                <span className="font-mono font-bold text-blue-600">
                  {activeField.ndwiTrend[hoverIndex].toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}