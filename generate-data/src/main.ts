import {GeoJSON} from "./geojson";
import * as fs from "fs";
import {Capitals} from "./capital";

const borders: GeoJSON = await fetch(
    "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
).then(r => r.json());

const cleanedBorders = borders.features.map(f => ({
    name: f.properties.ADMIN,
    code: f.properties.ISO_A2.toLowerCase(),
    border: f.geometry.coordinates,
}));

const capitals: Capitals = await fetch("http://www.geognos.com/api/en/countries/info/all.json").then(r => r.json());
const cleanedCapitals = Object.values(capitals.Results)
    .filter(c => c.Capital !== null)
    .map(c => ({
            code: c.CountryCodes.iso2.toLowerCase(),
            capital: {
                name: c.Name,
                lat: c.Capital!.GeoPt[0],
                lng: c.Capital!.GeoPt[1],
            }
        })
    );

const countries = cleanedBorders.map(b => {
    const capital = cleanedCapitals.find(c => c.code === b.code);
    return {
        ...b,
        capital: capital?.capital || null,
    };
})

fs.writeFileSync("../../public/countries.json", JSON.stringify(cleanedBorders));
