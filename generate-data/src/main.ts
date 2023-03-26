import { GeoJSON } from "./geojson";
import { Capitals } from "./capital";
import * as fs from "fs";
import simplify from "simplify-js";
import {fileURLToPath} from "url";
import path from "path";

const borders: GeoJSON = await fetch(
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
).then(r => r.json());

const cleanedBorders = borders.features.map(f => {
  let border = f.geometry.coordinates.map(c => c.map(c => c.map(c => [c[1], c[0]]))) as [number, number][][][];
  // Remove 3/4 of the datapoints, except if there are less than 50 datapoints
  border = border.map(borders => {
    return borders.map((borders, _) => {
      const mapped = borders.map(positions => ({ x: positions[0], y: positions[1] }));
      const simplified = simplify(mapped, 0.05, true);
      return simplified.map(positions => [positions.x, positions.y]);
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.resolve(__dirname, "../..");
const jsonPath = `${rootPath}/public/countries.json`;
fs.writeFileSync(jsonPath, JSON.stringify(countries));
