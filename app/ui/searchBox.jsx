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
    const [value, setValue] = useState('');
    // const [suggestId,setSuggestId] = useState(null);

    const handleSearch = useDebouncedCallback((term) => {
        setValue(term);
    },400);
    console.log(value);
    return (
        // <SearchBox name="srcBox" value={value} onChange={(e)=>{target(e)}} accessToken={accessToken} />
        <SearchBox id='srcBox' name='srcBox' value={value} accessToken={accessToken} onChange={(e)=>{handleSearch(e.target.value)}}/>
    );
}