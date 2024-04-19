import { Origin, Horoscope } from "circular-natal-horoscope-js";
import AstroChart from "@/app/ui/astroChart";
import Search from "@/app/ui/search";
import MapboxSearchBox from "@/app/ui/searchBox";
import NatalChartForm from "@/app/ui/natalChartSearch";
import { createNatalChart } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";
import { NatalchartFrom } from '@/app/lib/definitions';

// import { Suspense } from "react";

export default function NatalChart({
  // add aync cause of await data fetching inside component
  searchParams,
}: {
  searchParams: {
    addressQuery?: string;
    coordinates?: [];
    // date?: Date;
    // time?: Date;
    // unknown_time?: 'on' | null;
    // day?: 'on' | null;
    // nite?: 'on' | null;
  };
}) {
  // declare and create query variable on condition statement
  const address = searchParams?.addressQuery || "";
  // const coordinates = searchParams?.coordinates || "";
  let url_rewrited = address.replace(/ /g, "+");
  //url_rewrited = coordinates;
  // const session_token = crypto.randomUUID();

  console.log(`::: url_rewrited = ${url_rewrited}`);
  console.log(`::: GOOGLE_MAPS_API_KEY = ${process.env.GOOGLE_MAPS_API_KEY}`);
  console.log(`::: MAPBOX_TOKEN = ${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`);

  // console.log(`::: session_token = ${session_token}`);

  // This request should be refetched on every request.
  // Similar to `getServerSideProps`.
  // const dynamicData = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=GOOGLE_MAPS_API_KEY`, { cache: 'no-store' })
  // Fetch via GOOGLE MAP
  // const dynamicData = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address={url_rewrited}&key=GOOGLE_MAPS_API_KEY`, { cache: 'no-store' })
  // Fetch via MAPBOX
  // const resultSuggest = await fetch(`https://api.mapbox.com/search/searchbox/v1/suggest?q={url_rewrited}`, { cache: 'no-store' })

  const { year, month, day, hour, minute, latitude, longitude } = {
    year: 2020,
    month: 11, // 0 = January, 11 = December!
    day: 1,
    hour: 16,
    minute: 30,
    latitude: 40.0,
    longitude: -70.0,
  };
  const origin = new Origin({
    year: parseInt(year),
    month: parseInt(month) - 1, // La bibliothèque attend que janvier = 0
    date: parseInt(day),
    hour: parseInt(hour),
    minute: parseInt(minute),
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  });

  const horoscope = new Horoscope({
    origin: origin,
    houseSystem: "Placidus",
    zodiac: "tropical",
    aspectTypes: [
      "conjunction",
      "opposition",
      "trine",
      "square",
      "sextile",
      "semi-sextile",
    ],
  });

  // Store the generated horoscope
  //lastHoroscope = horoscope;
  // console.log(horoscope);
  console.log("::: Natal Chart SERVER LOG :::");
  console.log(
    "Variable horoscope from natal chart moving on server side only log server can see",
  );

  // const data = JSON.stringify(horoscope);

  return (
    <form action={createNatalChart}>
      {/* <Search placeholder="..."/>
      <h3>Url Query check:</h3>
      <p>{url_rewrited}</p> */}
      {/* <MapBoxAddressAutofill /> */}
      <MapboxSearchBox id="srcBox"
      name="srcBox"/>
      <NatalChartForm />
      <br />
      <label htmlFor="unknown_time" className="mb-2 block text-sm font-medium">
        Uknown time
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="unknown_time"
            name="unknown_time" // formData checkin point
            type="checkbox"
            className=""
          />
        </div>
      </div>
      <label htmlFor="day" className="mb-2 block text-sm font-medium">
        Day
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="day"
            name="day" // formData checkin point
            type="checkbox"
            className=""
          />
        </div>
      </div>
      <label htmlFor="nite" className="mb-2 block text-sm font-medium">
        Nite
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="nite"
            name="nite" // formData checkin point
            type="checkbox"
            className=""
          />
        </div>
      </div>
      

      {/* {JSON.stringify(horoscope)} */}
      {/* {data} */}
      <Button type="submit">Create Natal Chart</Button>
      <AstroChart />
    </form>
  );
}
