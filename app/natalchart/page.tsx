import { Origin, Horoscope } from "circular-natal-horoscope-js";
import AstroChart from "@/app/ui/astroChart";
import Search from "@/app/ui/search";

// import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
// import {animals} from "@/app/lib/data";
// import { Suspense } from "react";

export default async function NatalChart({ // add aync cause of await data fetching inside component
  searchParams
}:{
  searchParams:{
    address?: string
  }
}) {
  // declare and create query variable on condition statement
  const address = searchParams?.address || "";
  const url_rewrited = address.replace(/ /g, "+");
  const session_token = crypto.randomUUID();

  console.log(`::: url rewrited: ${url_rewrited}`);
  console.log(`::: key= ${process.env.GOOGLE_MAPS_API_KEY}`);
  console.log(`::: session token: ${session_token}`);
  
  
  
  // This request should be refetched on every request.
  // Similar to `getServerSideProps`.
  // const dynamicData = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=GOOGLE_MAPS_API_KEY`, { cache: 'no-store' })
  // const dynamicData = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address={}&key=GOOGLE_MAPS_API_KEY`, { cache: 'no-store' })

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
  console.log("Variable horoscope from natal chart moving on server side only log server can see");
  
  // const data = JSON.stringify(horoscope);

  return (
    <>
    <Search placeholder="..."/>
    <h3>Address Query :</h3>
    <p>{url_rewrited}</p>
    {/* <Autocomplete
      defaultItems={animals}
      label="Favorite Animal"
      placeholder="Search an animal"
      className="max-w-xs"
    >
      {(animal) => <AutocompleteItem key={animal.value}>{animal.label}</AutocompleteItem>}
    </Autocomplete> */}
    <br/>
    <AstroChart />
    {/* {JSON.stringify(horoscope)} */}
    {/* {data} */}
    </>
  );
}
