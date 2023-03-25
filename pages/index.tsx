import Head from "next/head";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useCachedResponse } from "@/hooks/cached-response";
import { Countries, Country } from "@/pages/types";
import { Search } from "@/components/search";
import { Random } from "@/components/random";
import { Button } from "@/components/button";
import { Close } from "@/components/close";

const WorldMap = dynamic(
  import("../components/world-map").then(i => ({ default: i.WorldMap })),
  { ssr: false }
);

export default function Home() {
  const countries = useCachedResponse<Countries>("countries.json");
  const [mode, setMode] = useState<"random" | "all" | "result">("all");
  const [showOutline, setShowOutline] = useState<boolean>(false);
  const [randomCountry, setRandomCountry] = useState<Country>();
  const [selectedCountry, setSelectedCountry] = useState<Country>();

  return (
    <>
      <Head>
        <title>Countries of the earth</title>
        <meta name="description" content="Improve your geographic knowledge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/*Indicator which country to pick*/}
      {mode === "random" ? (
        <p className="absolute top-2 left-1/2 pt-5 -translate-x-1/2 z-1000 bg-surface p-4 rounded-2xl">
          <button
            className={`absolute top-1 right-1`}
            onClick={() => {
              setMode("all");
              setSelectedCountry(undefined);
              setRandomCountry(undefined);
            }}
          >
            <Close />
          </button>
          Select <b className="font-semibold">{randomCountry?.countryName}</b> on the map
        </p>
      ) : null}
      {/*Result*/}
      {mode === "result" && !!selectedCountry ? (
        <div className="absolute top-2 pt-5 left-1/2 -translate-x-1/2 z-1000 bg-surface p-4 rounded-2xl">
          <button
            className={`absolute top-1 right-1`}
            onClick={() => {
              setMode("all");
              setSelectedCountry(undefined);
              setRandomCountry(undefined);
            }}
          >
            <Close />
          </button>
          {selectedCountry === randomCountry ? (
            <div className="relative">Congratulations!</div>
          ) : (
            <div>
              <div>
                You picked <b className="font-semibold">{selectedCountry.countryName}</b> instead of{" "}
                <b className="font-semibold">{randomCountry?.countryName}</b>
              </div>
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => {
                    setSelectedCountry(randomCountry);
                    setMode("all");
                  }}
                >
                  Show me {randomCountry?.countryName}
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/*Search bar*/}
      {mode === "all" && <Search countries={countries.data} countrySelected={setSelectedCountry} />}
      {/*Start country search*/}
      {mode !== "random" && (
        <Random
          onClick={() => {
            setMode("random");
            if (!countries.data) return;
            setRandomCountry(countries.data[Math.floor(Math.random() * countries.data.length)]);
          }}
        />
      )}
      {/*Toggle which disables country outlines*/}
      <div className="absolute rounded-2xl bg-surface p-2 bottom-2 left-2 z-1000">
        <label className="flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-gray-600"
            onChange={e => {
              const checked = e.target.checked;
              setShowOutline(checked);
            }}
            checked={showOutline}
          />
          <span className="ml-2 text-sm">Outline</span>
        </label>
      </div>
      {/*Map*/}
      <WorldMap
        country={mode === "random" ? undefined : selectedCountry}
        showOutline={showOutline}
        countries={countries.data}
        countryClicked={country => {
          if (mode === "random") {
            setMode("result");
          }
          setSelectedCountry(country);
        }}
      />
    </>
  );
}
