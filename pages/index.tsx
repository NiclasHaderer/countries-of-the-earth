import Head from "next/head";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useCachedResponse } from "@/hooks/cached-response";
import { Countries, Country } from "@/pages/types";
import { Overlay } from "@/components/overlay";

const WorldMap = dynamic(
  import("../components/world-map").then(i => ({ default: i.WorldMap })),
  { ssr: false }
);

export default function Home() {
  const countries = useCachedResponse<Countries>("countries.json");
  const [selectedCountry, setSelectedCountry] = useState<Country>();
  return (
    <>
      <Head>
        <title>Countries of the earth</title>
        <meta name="description" content="Improve your geographic knowledge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Overlay countries={countries.data} countrySelected={setSelectedCountry} />
      <WorldMap country={selectedCountry} />
    </>
  );
}
