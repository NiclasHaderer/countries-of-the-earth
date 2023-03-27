import Head from "next/head";
import dynamic from "next/dynamic";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { useCachedResponse } from "@/hooks/cached-response";
import { Countries, Country } from "@/pages/types";
import { Search } from "@/components/search";
import { Button } from "@/components/button";
import { Close } from "@/components/close";
import { useLocalStorage } from "@/hooks/localstorage";
import { Clear } from "@/components/clear";
import { Generate } from "@/components/generate";
import { Ripple } from "@/components/ripple/ripple";
import favIcon from "@/public/favicon.ico";

const WorldMap = dynamic(
  import("../components/world-map").then(i => ({ default: i.WorldMap })),
  { ssr: false }
);

type Modes =
  | {
      mode: "random";
      randomCountry: Country;
      selectedCountry?: undefined;
      center?: false;
    }
  | {
      mode: "all";
      selectedCountry?: Country;
      randomCountry?: undefined;
      center?: false;
    }
  | {
      mode: "all";
      selectedCountry: Country;
      randomCountry?: undefined;
      center?: true;
    }
  | {
      mode: "result";
      selectedCountry: Country;
      randomCountry: Country;
      center: boolean;
      done: boolean;
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
        <link rel="icon" href={favIcon.src} />
      </Head>
      {/*Indicator which country to pick*/}
      {appState.mode === "random" ? (
        <div className="absolute top-2 left-1/2 pt-5 -translate-x-1/2 z-1000 bg-surface p-4 rounded-2xl">
          <CloseButton onClick={() => setAppState({ mode: "all" })} />
          Select <b className="font-semibold">{appState.randomCountry.countryName}</b> on the map
          <Help
            onClick={() =>
              setAppState({
                mode: "all",
                selectedCountry: appState.randomCountry,
                center: true,
              })
            }
          >
            Help
          </Help>
        </div>
      ) : null}

      {/*Result*/}
      {appState.mode === "result" ? (
        <div className="absolute top-2 pt-5 left-1/2 -translate-x-1/2 z-1000 bg-surface p-4 rounded-2xl">
          <CloseButton onClick={() => setAppState({ mode: "all" })} />

          {appState.selectedCountry === appState.randomCountry ? (
            <div className="relative">Congratulations!</div>
          ) : (
            <div>
              <div>
                You picked <b className="font-semibold">{appState.selectedCountry.countryName}</b> instead of{" "}
                <b className="font-semibold">{appState.randomCountry.countryName}</b>
              </div>
              <Help
                onClick={() =>
                  setAppState({
                    mode: "all",
                    selectedCountry: appState.randomCountry,
                    center: true,
                  })
                }
              >
                Show me {appState.randomCountry.countryName}
              </Help>
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
      <OutlineButton onChange={checked => setShowOutline(checked)} checked={showOutline} />

      {/*Clear button*/}
      <ClearButton onClick={() => setAppState({ mode: "all" })} />

      {/*Map*/}
      <WorldMap
        country={appState.mode === "random" ? undefined : appState?.selectedCountry}
        showOutline={showOutline}
        center={appState.center}
        countries={countries.data}
        countryClicked={country => {
          if (appState.mode === "random" || (appState.mode === "result" && !appState.done)) {
            setAppState({
              mode: "result",
              selectedCountry: country,
              randomCountry: appState.randomCountry,
              center: false,
              done: country === appState.randomCountry,
            });
          } else {
            setAppState({ mode: "all", selectedCountry: country });
          }
        }}
      />
    </>
  );
}

const Help: FC<{ onClick: () => void; children: ReactNode }> = ({ onClick, children }) => {
  return (
    <div className="flex justify-center pt-4">
      <Button onClick={onClick}>{children}</Button>
    </div>
  );
};

const CloseButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button className="absolute top-1 right-1" onClick={onClick}>
      <Close />
    </button>
  );
};

const ClearButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Ripple
      duration={300}
      widthPercent={1}
      rippleClasses="!bg-gray-600"
      className="!absolute rounded-2xl bg-surface bottom-2 right-2 z-1000 overflow-hidden"
    >
      <button onClick={onClick} className="p-2 rounded-2xl bg-surface hover:bg-gray-200 transition-colors duration-300">
        <Clear />
      </button>
    </Ripple>
  );
};

export const Random: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <>
      <Ripple
        duration={300}
        widthPercent={1}
        rippleClasses="!bg-gray-600"
        className="overflow-hidden rounded-2xl z-1000 inline-block !absolute bottom-4 left-1/2 -translate-x-1/2"
      >
        <button
          className="p-4 rounded-2xl bg-surface hover:bg-gray-200 transition-colors duration-300"
          onClick={onClick}
        >
          <Generate />
        </button>
      </Ripple>
    </>
  );
};

const OutlineButton: FC<{ onChange: (checked: boolean) => void; checked: boolean }> = ({ onChange, checked }) => {
  const [internalChecked, setInternalChecked] = useState(checked);
  useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);
  return (
    <Ripple
      duration={300}
      rippleClasses="!bg-gray-600"
      className="rounded-2xl !absolute rounded-2xl bg-surface p-2 bottom-2 left-2 z-1000 overflow-hidden hover:bg-gray-200 transition-colors duration-300"
    >
      <label className="flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-gray-600"
          onChange={e => {
            const checked = e.target.checked;
            setInternalChecked(checked);
            setTimeout(() => onChange(checked));
          }}
          checked={internalChecked}
        />
        <span className="ml-2 text-sm">Outline</span>
      </label>
    </Ripple>
  );
};
