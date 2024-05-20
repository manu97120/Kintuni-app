"use client";

import { SearchBox } from "@mapbox/search-js-react";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapboxSearchBox() {
  const [inputV, setInputV] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [coordinates, setCoordinates] = useState([]);
  const [stateOnChange, setStateOnValue] = useState(false);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    if (term) {
      setInputV(term);
      setStateOnValue(true);
    } else {
      clearSearch();
    }

    replace(`${pathname}?${params.toString()}`);
  }, 400);

  function retrieve(sugO) {
    const coordinates = sugO.features[0].geometry.coordinates;
    const name = sugO.features[0].properties.name;

    setCoordinates(coordinates);
    setAddressQuery(name);
    replace(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    if (stateOnChange && coordinates.length) {
      params.set("addressQuery", addressQuery);
      params.set("longitude", coordinates[0]);
      params.set("latitude", coordinates[1]);
      replace(`${pathname}?${params.toString()}`);
    }
  }, [stateOnChange, coordinates]);

  function clearSearch() {
    setInputV("");
    setAddressQuery("");
    setCoordinates([]);
    setStateOnValue(false);
    params.delete("addressQuery");
    params.delete("longitude");
    params.delete("latitude");
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <SearchBox
      placeholder="Enter your address"
      value={addressQuery}
      accessToken={accessToken}
      onChange={(inputV) => {
        handleSearch(inputV);
        if (!inputV) clearSearch();  // Handle clearing when input is empty
      }}
      onRetrieve={(suggestId) => {
        retrieve(suggestId);
      }}
      // onClear={clearSearch}
      inputProps={{
        user_id: "srcBox",
        name:"searchBoox",
        id:"searchBoox"
      }}
    />
  );
}
