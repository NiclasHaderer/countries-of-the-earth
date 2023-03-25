import { MapContainer, Marker, Polygon, Popup, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FC, useEffect, useRef } from "react";
import { Countries, Country } from "@/pages/types";
import { MapPin } from "@/components/map-pin";
import { renderToString } from "react-dom/server";
import { divIcon, Marker as LeafletMarker, Polygon as LeafletPolygon } from "leaflet";

export const WorldMap: FC<{
  country?: Country;
  countries?: Countries;
  countryClicked?: (country: Country) => void;
  showOutline?: boolean;
}> = ({ country, countries, countryClicked, showOutline = false }) => {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      dragging={true}
      doubleClickZoom={true}
      scrollWheelZoom={true}
      attributionControl={false}
      zoomControl={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
      {country && <CountryDisplay country={country} />}
      {countries?.map((country, index) => (
        <Border
          key={index}
          border={country.border}
          visible={showOutline}
          onClick={() => countryClicked?.(country)}
          fill={false}
        />
      ))}
      <ZoomControl position={"bottomright"} />
    </MapContainer>
  );
};

const CountryDisplay: FC<{ country: Country }> = ({ country }) => {
  // const map = useMap();
  // Center to bbox
  // const corner1 = latLng(...country.bbox[0]);
  // const corner2 = latLng(...country.bbox[1]);
  // const bounds = latLngBounds(corner1, corner2);
  // map.fitBounds(bounds);

  // Show the popup
  const markerRef = useRef<LeafletMarker>(null);
  useEffect(() => void markerRef.current?.openPopup());

  return (
    <>
      <Marker
        ref={markerRef}
        autoPan={false}
        autoPanOnFocus={false}
        autoPanPadding={[0, 0]}
        position={
          "capitalLocation" in country
            ? [country.capitalLocation.lat, country.capitalLocation.lng]
            : [country.center.lat, country.center.lng]
        }
        icon={divIcon({
          html: renderToString(<MapPin className="stroke-red-600 !w-8 !h-8" />),
        })}
      >
        <Popup autoClose={false} autoPan={false} autoPanPadding={[0, 0]}>
          <div className="flex justify-center pb-1">
            <span className={`fi fi-${country.countryISO} mr-1`}></span>
          </div>
          <div className="flex">
            <b className="pr-0.5">Country: </b>
            {country.countryName}
          </div>
          <div className="flex">
            <b className="pr-0.5">Capital: </b>
            {country.capitalName}
          </div>
        </Popup>
      </Marker>
      <Border border={country.border} visible={true} fill={true} />
    </>
  );
};

const Border: FC<{
  border: Country["border"];
  onClick?: () => void;
  visible: boolean;
  fill: boolean;
}> = ({ border, onClick, visible, fill }) => {
  return (
    <>
      {border.map((border, index) => (
        <CustomPolygon border={border} visible={visible} onClick={onClick} key={index} fill={fill} />
      ))}
    </>
  );
};

const CustomPolygon: FC<{
  border: Country["border"][number];
  fill: boolean;
  visible: boolean;
  onClick?: () => void;
}> = ({ border, onClick, visible, fill }) => {
  const clickTime = useRef(0);
  const timeout = useRef<number | NodeJS.Timeout>();

  const polygon = useRef<LeafletPolygon>(null);
  useEffect(() => {
    polygon.current?.setStyle({ weight: visible ? 1 : 0, fillColor: visible ? "blue" : "transparent" });
  }, [visible]);
  return (
    <Polygon
      eventHandlers={{
        click: () => {
          const now = Date.now();
          if (now - clickTime.current < 200) {
            clearTimeout(timeout.current as NodeJS.Timeout);
            return;
          }
          clickTime.current = now;
          timeout.current = setTimeout(() => {
            onClick?.();
          }, 200);
        },
      }}
      ref={polygon}
      positions={border}
      color="blue"
      weight={visible ? 1 : 0}
      fillColor="red"
      fillOpacity={fill ? 0.1 : 0}
      fill={true}
      fillRule={"evenodd"}
    />
  );
};
