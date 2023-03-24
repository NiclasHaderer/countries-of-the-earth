import Head from "next/head";
import dynamic from "next/dynamic";
import React, { KeyboardEvent, useRef, useState } from "react";
import { useFocusTrap, useTabModifier } from "@/hooks/focus-trap";

const WorldMap = dynamic(
  import("../components/world-map").then(i => ({ default: i.WorldMap })),
  { ssr: false }
);

export default function Home() {
  const [currentSearch, setCurrentSearch] = useState("");
  const [autocomplete] = useState(["1", "2", "3"]);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  useFocusTrap(inputWrapperRef.current, () => false);
  const { focusPrevious, focusNext } = useTabModifier();

  const modifyFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusPrevious();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      focusNext();
    }
  };

  return (
    <>
      <Head>
        <title>Countries of the earth</title>
        <meta name="description" content="Improve your geographic knowledge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="m-0 absolute top-2 left-1/2 -translate-x-1/2 z-1000"
        ref={inputWrapperRef}
        onKeyDown={modifyFocus}
      >
        <input
          autoFocus={true}
          value={currentSearch}
          onChange={e => setCurrentSearch(e.target.value)}
          className="box-border rounded-xl w-full outline-none p-1"
          placeholder="Country or Capital"
        />
        <div className="rounded-xl mt-2 bg-surface flex flex-col overflow-hidden">
          {autocomplete.map((value, index) => (
            <button
              className="text-left border-b-slate-300 outline-none focus:bg-slate-200 hover:bg-slate-200 border-b-2 last:border-none p-1"
              key={index}
            >
              <span className="fi fi-gr mr-1"></span>
              asdf
            </button>
          ))}
        </div>
      </div>
      <WorldMap />
    </>
  );
}
