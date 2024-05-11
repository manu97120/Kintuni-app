import AstroChart from "@/app/ui/astroChart";
import MapboxSearchBox from "@/app/ui/searchBox";
import DateTimeMUI from "@/app/ui/natalChartSearch";
import { createNatalChart } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";

// import { Suspense } from "react";
export const dynamic = "force-dynamic";

export default function NatalChart({
  // add aync if await data fetching inside component
  searchParams,
}: {
  searchParams?: {
    addressQuery?: string;
    longitude?: string;
    lattitude?: string; // cause url tranfert string
    // date?: Date;
    // time?: Date;
    // unknown_time?: 'on' | null;
    // day?: 'on' | null;
    // nite?: 'on' | null;
  };
}) {
  // declare and create variable on condition statement
  const resAddressQuery = searchParams?.addressQuery || "";
  const resLongitude = parseInt(searchParams?.longitude || "");
  const resLattitude = parseInt(searchParams?.lattitude || "");
  // let params_retrieveFromUrl = addressQuery.replace(/ /g, "+");
  // params_retrieveFromUrl += coordinates;
  // const session_token = crypto.randomUUID();
  console.log(`data to show the svg`);

  console.log(
    `::: params retrieve From Url \n addressQuery: ${resAddressQuery} \n 
    Longitude: ${resLongitude} \n Lattitude: ${resLattitude}`,
  );
  console.log(`::: GOOGLE_MAPS_API_KEY = ${process.env.GOOGLE_MAPS_API_KEY}`);
  console.log(`::: MAPBOX_TOKEN = ${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`);

  // const data = JSON.stringify(horoscope);
  // Here how to bind data
  const CreateNatalChart = createNatalChart.bind(
    null,
    resAddressQuery,
    resLongitude,
    resLattitude,
  );

  return (
    <form action={CreateNatalChart} name="Search">
      {/* form attribute name for accessibility of all input elements inside cohérence  */}
      {/* <Search placeholder="..."/>
      <h3>Url Query check:</h3>
      <p>{url_rewrited}</p> */}
      {/* <MapBoxAddressAutofill /> */}
      <MapboxSearchBox />
      <DateTimeMUI />
      <br />
      <label htmlFor="longitude" className="mb-2 block text-sm font-medium">
        Longitude
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="longitude"
            name="longitude" // formData checkin point
            type="number"
            step={0.000001}
            // value={resLongitude ? resLongitude : ""}
            autoComplete="on"
            className="text-black"
          />
        </div>
      </div>
      <br />
      <label htmlFor="lattitude" className="mb-2 block text-sm font-medium">
        Lattitude
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="lattitude"
            name="lattitude" // formData checkin point
            type="number"
            step={0.000001}
            // value={resLattitude ? resLattitude : ""}
            autoComplete="on"
            className="text-black"
          />
        </div>
      </div>
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
