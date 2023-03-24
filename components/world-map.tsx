import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export const WorldMap = () => {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      scrollWheelZoom={false}
      attributionControl={false}
      zoomControl={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
    </MapContainer>
  );
};
