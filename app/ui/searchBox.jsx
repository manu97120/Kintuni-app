'use client'
// Cause we use a client library @mapbox/search-js-react
import { AddressAutofill } from '@mapbox/search-js-react';
// import { SearchBox } from "@mapbox/search-js-react";
// import { MapboxSearchBox } from "@mapbox/search-js-web";
// import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
// import {animals} from "@/app/lib/data";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export default function SearchBox() {
    console.log(`>>> SearchBox Client log`);
    console.log(`SearchBox acessToken = ${accessToken}`);
    
    return (
        <form>
            <AddressAutofill accessToken={accessToken}>
                <input type="text" name="address" autoComplete="street-address" className='text-black'/>
            </AddressAutofill>
            {/* <Autocomplete
                defaultItems={animals}
                label="Favorite Animal"
                placeholder="Search an animal"
                className="max-w-xs"
             >
                {(animal) => <AutocompleteItem key={animal.value}>{animal.label}</AutocompleteItem>}
            </Autocomplete> */}
        </form>
    );
}