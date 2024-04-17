'use client'
// Cause we use a client library @mapbox/search-js-react
import { AddressAutofill } from '@mapbox/search-js-react';
import { SearchBox } from '@mapbox/search-js-react';
import {useState} from 'react';
import { useDebouncedCallback } from 'use-debounce';
// import { SearchBox } from "@mapbox/search-js-react";
// import { MapboxSearchBox } from "@mapbox/search-js-web";
// import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
// import {animals} from "@/app/lib/data";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export function MapBoxAddressAutofill() {
    console.log(`>>> SearchBox Client log`);
    console.log(`SearchBox acessToken = ${accessToken}`);
    
    return (
        <AddressAutofill accessToken={accessToken}>
            <input type="text" name="address" autoComplete="street-address" className='text-black'/>
        </AddressAutofill>        
    );
}

export function MapboxSearchBox() {
    // const session_token = crypto.randomUUID(); // automatic session token
    const [inputV, setInputV] = useState('');
    const [suggestId,setSuggestId] = useState([]);

    const handleSearch = useDebouncedCallback((term) => {
        setInputV(term);
    },400);

    // console.log(`::: session_token = ${session_token}`);
    console.log(`Searchbox input: ${inputV}`);

    function suggests(sugO){
        console.log(`::: SearchBoxSuggestionsResults object`);
        console.log(sugO);
        // console.log(sugO.suggestions[0].mapbox_id);
        // const sugId = sugO.suggestions[0].mapbox_id;
        // setSuggestId(sugId);
        console.log(`::: SearchBoxSuggestionsResults filter`);
        console.log(sugO.suggestions[0].mapbox_id);
        console.log(typeof sugO.suggestions[0].mapbox_id);
        // console.log(suggestId);
    };

    function retrieve(sugO){
        console.log(`::: SearchBoxRetrieve geo coordinates`);
        console.log(sugO);
        console.log(`Longtitude: ${sugO.features[0].geometry.coordinates[0]} \n Lattitude: ${sugO.features[0].geometry.coordinates[1]}`);
        // const sugId = sugO.suggestions[0].mapbox_id;
        setSuggestId(sugO.features[0].geometry.coordinates);
        console.log(`::: SearchBoxRetrievesResults filter`);
        // console.log(sugO.suggestions[0].mapbox_id);
        // console.log(typeof sugO.suggestions[0].mapbox_id);
        console.log(suggestId);
    };

    return (
        // <SearchBox name="srcBox" value={value} onChange={(e)=>{target(e)}} accessToken={accessToken} />
        <SearchBox id="srcBox" name="srcBox" value={inputV} 
            accessToken={accessToken} onChange={(inputV)=>{handleSearch(inputV)}}
            // interceptSearch={inputV} options={types}
            onSuggest={(inputV)=>{suggests(inputV)}} onRetrieve={(inputV)=>{retrieve(inputV)}}
        />
    );
}