import { Origin, Horoscope } from "circular-natal-horoscope-js";
import AstroChart from "@/app/ui/astroChart";

export default function NatalChart() {
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
    <AstroChart />
    {/* {JSON.stringify(horoscope)} */}
    {/* {data} */}
    </>
  );
}
