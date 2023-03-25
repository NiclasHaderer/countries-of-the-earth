import Head from "next/head";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useCachedResponse } from "@/hooks/cached-response";
import { Countries, Country } from "@/pages/types";
import { Search } from "@/components/search";
import { Random } from "@/components/random";
import { Button } from "@/components/button";
import { Close } from "@/components/close";
import { useLocalStorage } from "@/hooks/localstorage";

const WorldMap = dynamic(
  import("../components/world-map").then(i => ({ default: i.WorldMap })),
  { ssr: false }
);

type Modes =
  | {
      mode: "random";
      randomCountry: Country;
      selectedCountry?: undefined;
    }
  | {
      mode: "all";
      selectedCountry?: Country;
      randomCountry?: undefined;
    }
  | {
      mode: "result";
      selectedCountry: Country;
      randomCountry: Country;
    };

export default function Home() {
  const countries = useCachedResponse<Countries>("countries.json");
  const [showOutline, setShowOutline] = useLocalStorage("outline", false);
  const [appState, setAppState] = useState<Modes>({ mode: "all" });

  return (
    <>
      <Head>
        <title>Countries of the earth</title>
        <meta name="description" content="Improve your geographic knowledge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/*Indicator which country to pick*/}
      {appState.mode === "random" ? (
        <p className="absolute top-2 left-1/2 pt-5 -translate-x-1/2 z-1000 bg-surface p-4 rounded-2xl">
          <button
            className={`absolute top-1 right-1`}
            onClick={() => {
              setAppState({ mode: "all" });
            }}
          >
            <Close />
          </button>
          Select <b className="font-semibold">{appState.randomCountry.countryName}</b> on the map
        </p>
      ) : null}

      {/*Result*/}
      {appState.mode === "result" ? (
        <div className="absolute top-2 pt-5 left-1/2 -translate-x-1/2 z-1000 bg-surface p-4 rounded-2xl">
          <button
            className={`absolute top-1 right-1`}
            onClick={() => {
              setAppState({ mode: "all" });
            }}
          >
            <Close />
          </button>
          {appState.selectedCountry === appState.randomCountry ? (
            <div className="relative">Congratulations!</div>
          ) : (
            <div>
              <div>
                You picked <b className="font-semibold">{appState.selectedCountry.countryName}</b> instead of{" "}
                <b className="font-semibold">{appState.randomCountry.countryName}</b>
              </div>
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() =>
                    setAppState({
                      mode: "all",
                      selectedCountry: appState.randomCountry,
                    })
                  }
                >
                  Show me {appState.randomCountry.countryName}
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/*Search bar*/}
      {appState.mode === "all" && (
        <Search
          countries={countries.data}
          countrySelected={country => {
            setAppState({ mode: "all", selectedCountry: country });
          }}
        />
      )}

      {/*Start country search*/}
      {appState.mode !== "random" && (
        <Random
          onClick={() => {
            if (!countries.data) return;
            setAppState({
              mode: "random",
              randomCountry: countries.data[Math.floor(Math.random() * countries.data.length)],
            });
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
        country={appState.mode === "random" ? undefined : appState?.selectedCountry}
        showOutline={showOutline}
        countries={countries.data}
        countryClicked={country => {
          if (appState.mode === "random") {
            setAppState({ mode: "result", selectedCountry: country, randomCountry: appState.randomCountry });
          } else {
            setAppState({ mode: "all", selectedCountry: country });
          }
        }}
      />
    </>
  );
}
