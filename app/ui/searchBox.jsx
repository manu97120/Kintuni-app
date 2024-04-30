"use client";
// Cause we use a client library @mapbox/search-js-react
// import { AddressAutofill } from "@mapbox/search-js-react";
import { SearchBox } from "@mapbox/search-js-react";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

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
  const [suggestResults,setSuggestResult] = useState(null);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();

  //useEffect(() => {},[]);
  const handleSearch = useDebouncedCallback((term) => {
    // const params = new URLSearchParams(searchParams);

    // if(term) : delete params query
    if (term) {
      setInputV(term);
      console.log(`onChange event:`);
      console.log(term);
      console.log(`Searchbox input: ${inputV}`);
      setStateOnValue(true);
      // params.set("addressQuery", addressQuery);
      // params.set("longitude", coordinates[0]);
      // params.set("lattitude", coordinates[1]);
      // params.set("coordinates", coordinates);
    } else {
      setStateOnValue(false);
      params.delete("addressQuery");
      params.delete("longitude");
      params.delete("lattitude");
    }

    // updates the URL with the user's search data without reloading
    replace(`${pathname}?${params.toString()}`);
  }, 400);

  // console.log(`::: session_token = ${session_token}`);
  // test async await approach
  function retrieve(sugO) {
  
    console.log(`::: SearchBoxRetrieve geo coordinates`);
    // console.log(sugO);
    console.log(sugO.features[0].geometry.coordinates);
    console.log(sugO.features[0].properties.name);
    // console.log(`Longtitude: ${sugO.features[0].geometry.coordinates[0]} \n Lattitude: ${sugO.features[0].geometry.coordinates[1]}`);
    // const sugId = sugO.suggestions[0].mapbox_id;
    // const params = new URLSearchParams(searchParams);
  
    // change inputV by town name retrieve directly
    // if (stateOnChange) {
      setCoordinates(sugO.features[0].geometry.coordinates);
      setAddressQuery(sugO.features[0].properties.name);
      
      // params.set("coordinates", coordinates);
    // } //else {
    // params.delete("addressQuery");
    // params.delete("longitude");
    // params.delete("lattitude");
    // }
  
    // updates the URL with the user's search data without reloading
    replace(`${pathname}?${params.toString()}`);
    // console.log(`::: SearchBoxRetrievesResults coordinates`);
    // console.log(`::: longitude: ${coordinates[0]}`);
    // console.log(`::: lattitude: ${coordinates[1]}`);
    // console.log(coordinates);
    // return sugO;
  }
  // console.log(`session_token: ${session_token}`);
  // if(suggestResults){
  //   console.log(`suggestResult\n${JSON.stringify(suggestResults)}`);
  // //   setCoordinates(suggestResults.features[0].geometry.coordinates);
  // //   setAddressQuery(suggestResults.features[0].properties.name);
  // //   params.set("addressQuery", addressQuery);
  // //   params.set("longitude", coordinates[0]);
  // //   params.set("lattitude", coordinates[1]);
  // //   // params.set("coordinates", coordinates);
  // //   // updates the URL with the user's search data without reloading
  // // // replace(`${pathname}?${params.toString()}`);
  // }
  useEffect(() => {
    if(stateOnChange && coordinates){
      params.set("addressQuery", addressQuery);
      params.set("longitude", coordinates[0]);
      params.set("lattitude", coordinates[1]);
       // updates the URL with the user's search data without reloading
      replace(`${pathname}?${params.toString()}`);
    }
  },[stateOnChange,coordinates]);

  return (
    // <SearchBox name="srcBox" value={value} onChange={(e)=>{target(e)}} accessToken={accessToken} />
    <SearchBox
      id="srcBox"
      name="srcBox"
      input="srcBox"
      placeholder="Enter your Address Query"
      // options={
      //  { language:"fr",
      //   country:"FR"}
      // }
      // key={1}
      // select={}
      
      value={addressQuery}
      // inputValue={addressQuery ? addressQuery : ""}
      accessToken={accessToken}
      onChange={(inputV) => {
        handleSearch(inputV);
      }}
      // interceptSearch={inputV} options={types}
      // onSuggest={(inputV) => {
      //   suggests(inputV);
      // }}
      onRetrieve={(suggestId) => {
        retrieve(suggestId)
        // setSuggestResult(retrieve(suggestId))
        
      }}
    />
  );
}

function suggests(sugO) {
  // console.log(`::: SearchBoxSuggestionsResults object`);
  // console.log(sugO);
  console.log(sugO.suggestions[0].mapbox_id);
  // setSuggestId(sugO.suggestions[0].mapbox_id);
  // console.log(`::: SearchBoxSuggestionsResults object`);
  console.log(`::: SearchBoxSuggestionsResults filter`);

  // console.log(typeof sugO.suggestions[0].mapbox_id);
  // console.log(suggestId);
}

// function retrieve(sugO) {
  
//   console.log(`::: SearchBoxRetrieve geo coordinates`);
//   // console.log(sugO);
//   console.log(sugO.features[0].geometry.coordinates);
//   console.log(sugO.features[0].properties.name);
//   // console.log(`Longtitude: ${sugO.features[0].geometry.coordinates[0]} \n Lattitude: ${sugO.features[0].geometry.coordinates[1]}`);
//   // const sugId = sugO.suggestions[0].mapbox_id;
//   // const params = new URLSearchParams(searchParams);

//   // change inputV by town name retrieve directly
//   // if (stateOnChange) {
//   //   setCoordinates(sugO.features[0].geometry.coordinates);
//   //   setAddressQuery(sugO.features[0].properties.name);
//   //   params.set("addressQuery", addressQuery);
//   //   params.set("longitude", coordinates[0]);
//   //   params.set("lattitude", coordinates[1]);
//     // params.set("coordinates", coordinates);
//   //} //else {
//   // params.delete("addressQuery");
//   // params.delete("longitude");
//   // params.delete("lattitude");
//   // }

//   // updates the URL with the user's search data without reloading
//   // replace(`${pathname}?${params.toString()}`);
//   // console.log(`::: SearchBoxRetrievesResults coordinates`);
//   // console.log(`::: longitude: ${coordinates[0]}`);
//   // console.log(`::: lattitude: ${coordinates[1]}`);
//   // console.log(coordinates);
//   return sugO;
// }