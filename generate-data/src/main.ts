import { GeoJSON } from "./geojson";
import { Capitals } from "./capital";
import * as fs from "fs";

const borders: GeoJSON = await fetch(
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
).then(r => r.json());

const cleanedBorders = borders.features.map(f => ({
  countryName: f.properties.ADMIN,
  countryISO: f.properties.ISO_A2.toLowerCase(),
  border: f.geometry.coordinates,
}));

const capitals: Capitals = await fetch("http://www.geognos.com/api/en/countries/info/all.json").then(r => r.json());
const cleanedCapitals = Object.values(capitals.Results)
  .filter(c => c.Capital !== null)
  .map(c => ({
    countryISO: c.CountryCodes.iso2.toLowerCase(),
    capitalName: c.Capital!.Name,
    capitalLocation: {
      lat: c.Capital!.GeoPt[0],
      lng: c.Capital!.GeoPt[1],
    },
  }));

const countries: (
  | { border: number[][][][]; countryISO: string; countryName: string; capitalName: string }
  | {
      border: number[][][][];
      countryISO: string;
      countryName: string;
      capitalLocation: { lng: number; lat: number };
    }
)[] = cleanedBorders.map(country => {
  const capital = cleanedCapitals.find(capital => capital.countryISO === country.countryISO);
  if (!capital) return { ...country, capitalName: "N/A" };
  return {
    ...country,
    ...capital,
  };
});

fs.writeFileSync("../../public/countries.json", JSON.stringify(countries));
