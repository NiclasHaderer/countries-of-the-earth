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
        className="absolute top-2 left-1/2 -translate-x-1/2 z-1000 pointer-events-none w-full flex justify-center"
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
        <div className="w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/4 pointer-events-auto">
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
            className="box-border rounded-xl w-full outline-none p-2 hover:bg-gray-100 transition-colors duration-300"
            placeholder="Country or Capital"
          />
          <div className="rounded-xl mt-2 bg-surface flex flex-col overflow-hidden">
            {autocomplete.map((country, index) => (
              <button
                className="text-left border-b-gray-300 outline-none focus:bg-gray-200 hover:bg-gray-200 border-b-2 last:border-none p-1 overflow-hidden text-ellipsis whitespace-nowrap"
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
      </div>
    </>
  );
};
