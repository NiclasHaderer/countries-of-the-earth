import { GeoJSON } from "./geojson";
import { Capitals } from "./capital";
import * as fs from "fs";

const borders: GeoJSON = await fetch(
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
).then(r => r.json());

const cleanedBorders = borders.features.map(f => {
  let border = f.geometry.coordinates.map(c => c.map(c => c.map(c => [c[1], c[0]])));
  // Remove 3/4 of the datapoints, except if there are less than 50 datapoints
  border = border.map(borders => {
    return borders.map((borders, _) => {
      if (borders.length < 50) {
        return borders;
      }
      return borders.filter((_, i) => i % 10 === 0 || i === borders.length - 1);
    });
  });

  const maxLat = Math.max(...border.map(b => Math.max(...b.map(b => Math.max(...b.map(b => b[0]))))));
  const minLat = Math.min(...border.map(b => Math.min(...b.map(b => Math.min(...b.map(b => b[0]))))));
  const maxLng = Math.max(...border.map(b => Math.max(...b.map(b => Math.max(...b.map(b => b[1]))))));
  const minLng = Math.min(...border.map(b => Math.min(...b.map(b => Math.min(...b.map(b => b[1]))))));
  const bbox = [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
  return {
    countryName: f.properties.ADMIN,
    countryISO: f.properties.ISO_A2.toLowerCase(),
    border: border,
    bbox,
    center: {
      lat: (maxLat + minLat) / 2,
      lng: (maxLng + minLng) / 2,
    },
  };
});

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
  if (!capital) {
    console.log(`No capital for ${country.countryName}`);
    return { ...country, capitalName: "N/A" };
  }
  return {
    ...country,
    ...capital,
  };
});

fs.writeFileSync("../../public/countries.json", JSON.stringify(countries));
