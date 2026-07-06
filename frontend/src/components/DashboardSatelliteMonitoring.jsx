import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

export default function DashboardSatelliteMonitoring({
  field,
  analysis,
}) {
  const center = [
    field.latitude,
    field.longitude,
  ];

  const vegetationDetected =
    analysis?.vegetation_analysis
      ?.vegetation_detected ?? false;

  const stressLevel =
    analysis?.moisture_stress_analysis
      ?.stress_level ?? "unknown";

  const markerColor =
    stressLevel === "high"
      ? "#ba1a1a"
      : stressLevel === "moderate"
        ? "#d97706"
        : "#2c694e";

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-[#eeeeec]">
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Circle
          center={center}
          radius={250}
          pathOptions={{
            color: markerColor,
            fillColor: markerColor,
            fillOpacity: 0.18,
            weight: 2,
            dashArray: "6 5",
          }}
        />

        <CircleMarker
          center={center}
          radius={9}
          pathOptions={{
            color: "#ffffff",
            fillColor: markerColor,
            fillOpacity: 1,
            weight: 3,
          }}
        >
          <Popup>
            <div className="min-w-[180px]">
              <strong>{field.name}</strong>

              <br />

              Configured analysis location

              <br />

              Vegetation:{" "}
              {vegetationDetected
                ? "Detected"
                : "Not detected"}

              <br />

              Growth stage:{" "}
              {analysis?.phenology_analysis
                ?.growth_stage?.replaceAll(
                  "_",
                  " ",
                ) ?? "Unavailable"}

              <br />

              Moisture stress:{" "}
              {stressLevel}

              <br />

              Latest observation:{" "}
              {analysis?.analysis_date ??
                "Unavailable"}
            </div>
          </Popup>
        </CircleMarker>
      </MapContainer>

      <div className="absolute top-4 left-14 z-[500] bg-white/95 border border-[#eeeeec] rounded-lg shadow-sm px-3 py-2 pointer-events-none">
        <span className="block text-[10px] font-mono font-bold uppercase text-text-muted">
          Configured Analysis AOI
        </span>

        <span className="block text-[12px] font-semibold text-text-dark mt-0.5">
          {field.name}
        </span>

        <span className="block text-[10px] font-mono text-text-muted mt-1">
          {field.latitude.toFixed(4)},{" "}
          {field.longitude.toFixed(4)}
        </span>
      </div>

      <div className="absolute bottom-4 left-4 z-[500] bg-white/95 border border-[#eeeeec] rounded-lg shadow-sm px-3 py-2 pointer-events-none">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: markerColor,
            }}
          />

          <span className="text-[11px] font-medium text-text-dark uppercase">
            {stressLevel} moisture stress
          </span>
        </div>
      </div>
    </div>
  );
}