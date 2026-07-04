import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const fields = [
  {
    id: "A-01",
    crop: "Wheat",
    status: "Healthy",
    moisture: 78,
    color: "#2c694e",
    positions: [
      [26.9188, 75.7772],
      [26.9194, 75.7801],
      [26.9181, 75.7828],
      [26.9157, 75.7821],
      [26.9146, 75.7794],
      [26.9161, 75.7768],
    ],
  },
  {
    id: "A-02",
    crop: "Mustard",
    status: "High Stress",
    moisture: 28,
    color: "#ba1a1a",
    positions: [
      [26.9118, 75.7876],
      [26.9123, 75.7904],
      [26.9108, 75.7932],
      [26.9082, 75.7924],
      [26.9074, 75.7896],
      [26.9091, 75.7872],
    ],
  },
  {
    id: "B-01",
    crop: "Barley",
    status: "Moderate Stress",
    moisture: 49,
    color: "#d97706",
    positions: [
      [26.9185, 75.7986],
      [26.9191, 75.8017],
      [26.9178, 75.8044],
      [26.9152, 75.8038],
      [26.9143, 75.8009],
      [26.9159, 75.7982],
    ],
  },
];

export default function DashboardSatelliteMonitoring() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-[#eeeeec]">
      <MapContainer
        center={[26.9124, 75.7903]}
        zoom={14}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {fields.map((field) => (
          <Polygon
            key={field.id}
            positions={field.positions}
            pathOptions={{
              color: field.color,
              fillColor: field.color,
              fillOpacity: 0.45,
              weight: 3,
            }}
          >
            <Popup>
              <div>
                <strong>Field {field.id}</strong>
                <br />
                Crop: {field.crop}
                <br />
                Status: {field.status}
                <br />
                Moisture: {field.moisture}%
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
}