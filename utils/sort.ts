import { Countries } from "@/pages/types";
import * as fuzzysort from "fuzzysort";

export const getResults = (search: string, countries: Countries, size = 7) => {
  const countryResult = fuzzysort.go(search, countries, { key: "capitalName" });
  const capitalResult = fuzzysort.go(search, countries, { key: "countryName" });
  return countryResult
    .concat(capitalResult)
    .filter((v, i, a) => a.findIndex(t => t.obj.countryISO === v.obj.countryISO) === i)
    .sort((a, b) => b.score - a.score)
    .map(i => i.obj)
    .slice(0, size);
};
