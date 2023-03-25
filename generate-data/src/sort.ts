import * as fs from "fs";
import fuzzysort from "fuzzysort";

const countries: any[] = JSON.parse(fs.readFileSync("../../public/countries.json", "utf8"));
const countryResult = fuzzysort.go("Washington", countries, { key: ["capitalName"] });
const capitalResult = fuzzysort.go("United States", countries, { key: ["countryName"] });

// Merge botha and unique by countryISO
const result = countryResult
  .concat(capitalResult)
  .filter((v, i, a) => a.findIndex(t => t.obj.countryISO === v.obj.countryISO) === i)
  .sort((a, b) => b.score - a.score)
  .map(i => i.obj)
  .slice(0, 7);
console.log(result.map(i => i));
