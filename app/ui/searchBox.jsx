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
  const [stateOnChange, setStateOnValue] = useState(false);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    setInputV(term);
    console.log(`onChange event:`);
    console.log(term);
    // if(term) : delete params query
     if (term) {
      setStateOnValue(true);
    }

    // updates the URL with the user's search data without reloading
    // replace(`${pathname}?${params.toString()}`);
  }, 400);

  // console.log(`::: session_token = ${session_token}`);
  console.log(`Searchbox input: ${inputV}`);
  // test async await approach
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
    

    setCoordinates(sugO.features[0].geometry.coordinates);
    setAddressQuery(sugO.features[0].properties.name);

    // change inputV by town name retrieve directly
    if (stateOnChange) {
      params.set("addressQuery", addressQuery);
      params.set("longitude", coordinates[0]);
      params.set("lattitude", coordinates[1]);
      // params.set("coordinates", coordinates);
    }else{
      params.delete("addressQuery","longitude","lattitude");
    }

    // updates the URL with the user's search data without reloading
    replace(`${pathname}?${params.toString()}`);
    console.log(`::: SearchBoxRetrievesResults coordinates`);
    console.log(`::: longitude: ${coordinates[0]}`);
    console.log(`::: lattitude: ${coordinates[1]}`);
    // console.log(coordinates);
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
