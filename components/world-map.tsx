import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FC } from "react";
import { Country } from "@/pages/types";
import { MapPin } from "@/components/MapPin";
import { renderToString } from "react-dom/server";
import { divIcon } from "leaflet";

export const WorldMap: FC<{ country?: Country }> = ({ country }) => {
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
      {country && <CountryDisplay country={country} />}
    </MapContainer>
  );
};

const CountryDisplay: FC<{ country: Country }> = ({ country }) => {
  return (
    <>
      {"capitalLocation" in country ? (
        <Marker
          position={[country.capitalLocation.lat, country.capitalLocation.lng]}
          icon={divIcon({
            html: renderToString(<MapPin />),
          })}
        >
          <Popup>
            <div className="flex flex-col">
              <span className={`fi fi-${country.countryISO} mr-1`}></span>
              {country.countryName}
            </div>
          </Popup>
        </Marker>
      ) : null}
    </>
  );
};
