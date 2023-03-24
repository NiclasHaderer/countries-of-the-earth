import { GeoJSON } from "./geojson";
import * as fs from "fs";

const borders: GeoJSON = await fetch(
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
).then(r => r.json());

const countries = borders.features.map(f => ({
  name: f.properties.ADMIN,
  code: f.properties.ISO_A2,
  border: f.geometry.coordinates,
}));

fs.writeFileSync("../../public/countries.json", JSON.stringify(countries));
