
import { AddressAutofill } from '@mapbox/search-js-react';

const accessToken = 'pk.eyJ1Ijoia21wYSIsImEiOiJjbHVoczQ1c3UybWpwMnFuaTJnaml3dTVjIn0.rcjRvXGn1KV0DvFtMwsx-A';

export default function Component() {
    return (
        <form>
            <AddressAutofill accessToken={accessToken}>
                <input type="text" name="address" autocomplete="street-address" />
            </AddressAutofill>
        </form>
    );
}