import { FC, KeyboardEvent, useRef, useState } from "react";
import { useFocusTrap, useTabModifier } from "@/hooks/focus-trap";
import { Countries, Country } from "@/pages/types";
import { getResults } from "@/utils/sort";

export const Search: FC<{
  countries?: Countries;
  countrySelected?: (country: Country) => void;
}> = ({ countries, countrySelected }) => {
  // Focus, etc...
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  useFocusTrap(inputWrapperRef.current, () => false);
  const { focusPrevious, focusNext } = useTabModifier();

  // Input and autocomplete
  const [autocomplete, setAutocomplete] = useState<Countries>([]);

  return (
    <>
      <div
        className="absolute top-2 left-1/2 -translate-x-1/2 z-1000"
        ref={inputWrapperRef}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "ArrowUp") {
            event.preventDefault();
            focusPrevious();
          } else if (event.key === "ArrowDown") {
            event.preventDefault();
            focusNext();
          }
        }}
      >
        <input
          onChange={e => {
            const currentSearch = e.target.value;
            if (!countries || !currentSearch) {
              setAutocomplete([]);
              return;
            }
            const results = getResults(currentSearch, countries);
            setAutocomplete(results);
          }}
          className="box-border rounded-xl w-full outline-none p-2"
          placeholder="Country or Capital"
        />
        <div className="rounded-xl mt-2 bg-surface flex flex-col overflow-hidden">
          {autocomplete.map((country, index) => (
            <button
              className="text-left border-b-slate-300 outline-none focus:bg-slate-200 hover:bg-slate-200 border-b-2 last:border-none p-1"
              key={index}
              onClick={() => {
                countrySelected?.(country);
                setAutocomplete([]);
              }}
            >
              <span className={`fi fi-${country.countryISO} mr-1`}></span>
              {country.countryName}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
