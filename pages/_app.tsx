import type { AppProps } from "next/app";
import React from "react";
import "./global.css";
import "../components/ripple/ripple.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
