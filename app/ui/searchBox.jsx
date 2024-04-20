"use client";
// Cause we use a client library @mapbox/search-js-react
// import { AddressAutofill } from "@mapbox/search-js-react";
import { SearchBox } from "@mapbox/search-js-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
// import { SearchBox } from "@mapbox/search-js-react";
// import { MapboxSearchBox } from "@mapbox/search-js-web";
// import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
// import {animals} from "@/app/lib/data";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function MapBoxAddressAutofill() {
  console.log(`>>> SearchBox Client log`);
  console.log(`SearchBox acessToken = ${accessToken}`);

  return (
    <AddressAutofill accessToken={accessToken}>
      <input
        type="text"
        name="address"
        autoComplete="street-address"
        className="text-black"
      />
    </AddressAutofill>
  );
}

export default function MapboxSearchBox() {
  // const session_token = crypto.randomUUID(); // automatic session token
  const [inputV, setInputV] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [suggestId, setSuggestId] = useState("");
  const [coordinates, setCoordinates] = useState([]);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    setInputV(term);
    // if(term) : delete params query
    const params = new URLSearchParams(searchParams);
    if (!term) {
      params.delete("address", "coordinates");
    }

    // updates the URL with the user's search data without reloading
    replace(`${pathname}?${params.toString()}`);
    // if(term) : delete params query
  }, 400);

  // console.log(`::: session_token = ${session_token}`);
  console.log(`Searchbox input: ${inputV}`);

  function suggests(sugO) {
    // console.log(`::: SearchBoxSuggestionsResults object`);
    // console.log(sugO);
    // console.log(sugO.suggestions[0].mapbox_id);
    setSuggestId(sugO.suggestions[0].mapbox_id);
    // console.log(`::: SearchBoxSuggestionsResults object`);
    console.log(`::: SearchBoxSuggestionsResults filter`);

    // console.log(typeof sugO.suggestions[0].mapbox_id);
    console.log(suggestId);
  }

  function retrieve(sugO) {
    // console.log(`::: SearchBoxRetrieve geo coordinates`);
    // console.log(sugO);
    // console.log(`Longtitude: ${sugO.features[0].geometry.coordinates[0]} \n Lattitude: ${sugO.features[0].geometry.coordinates[1]}`);
    // const sugId = sugO.suggestions[0].mapbox_id;
    const params = new URLSearchParams(searchParams);

    setCoordinates(sugO.features[0].geometry.coordinates);
    setAddressQuery(sugO.features[0].properties.name);

    // change inputV by town name retrieve directly
    if (addressQuery && coordinates) {
      params.set("addressQuery", addressQuery);
      params.set("coordinates", coordinates);
    }

    // updates the URL with the user's search data without reloading
    replace(`${pathname}?${params.toString()}`);
    console.log(`::: SearchBoxRetrievesResults coordinates`);
    console.log(coordinates);
  }

  return (
    // <SearchBox name="srcBox" value={value} onChange={(e)=>{target(e)}} accessToken={accessToken} />
    <SearchBox
      id="srcBox"
      name="srcBox"
      value={addressQuery}
      accessToken={accessToken}
      onChange={(inputV) => {
        handleSearch(inputV);
      }}
      // interceptSearch={inputV} options={types}
      onSuggest={(inputV) => {
        suggests(inputV);
      }}
      onRetrieve={(suggestId) => {
        retrieve(suggestId);
      }}
    />
  );
}
