"use client";
import { useState, useEffect } from "react";
import moment from "moment-timezone";
// import DateTimeMUI from "@/app/ui/natalChartSearch";
import { Chart } from "@astrodraw/astrochart";
// import { Origin, Horoscope } from "circular-natal-horoscope-js";
import { Origin, Horoscope } from "@/app/lib/circularNatalHoro";
import MapboxSearchBox from "@/app/ui/searchBox";
// import { saveHoroscope } from "@/app/lib/actions_db";

interface AspectLevels {
  major: boolean;
  minor: boolean;
}
// Define the type for the `planets` object
interface Planets {
  [key: string]: number[]; // Assuming degrees are stored as an array of numbers
}

export const dynamic = "force-dynamic";

export default function HoroscopePage({
  // add aync if await data fetching inside component
  searchParams,
}: {
  searchParams?: {
    addressQuery?: string;
    longitude?: string;
    lattitude?: string;
  }
}) {
  
  const [horoscopeFormData, sethoroscopeFormData] = useState({
    date: moment().format("YYYY-MM-DD"),
    time: moment().format("HH:mm:00"),
    latitude: "",
    longitude: "",
    houseSystem: "placidus",
    zodiacSystem: "tropical",
    language: "en",
    aspectLevels: {
      major: true,
      minor: true,
    },
    customOrbs: {
      conjunction: 0,
      opposition: 0,
      trine: 0,
      square: 0,
      sextile: 0,
      quincunx: 0,
      quintile: 0,
      septile: 0,
      "semi-square": 0,
      "semi-sextile": 0,
    },
  });

  
  
  const [horoscope, setHoroscope] = useState<Horoscope | null>(null);

  useEffect(() => {
    loadLanguageSelect();
    loadUI();
  }, []);

  useEffect(() => {
    loadTableTitles();
  }, [horoscopeFormData.language]);

  // Function to update form data from URL params
  useEffect(() => {
    // declare and create variable on condition statement
  // const resAddressQuery = searchParams?.addressQuery || "";
  const resLongitude = searchParams?.longitude || "";
  const resLattitude = searchParams?.lattitude || "";
    // const { date, time, longitude: urlLongitude, latitude: urlLatitude } = query;
    // const { resAddressQuery,resLongitude, resLattitude } = searchParams;

    // if (date) sethoroscopeFormData((prevData) => ({ ...prevData, date }));
    // if (time) sethoroscopeFormData((prevData) => ({ ...prevData, time }));
    if (resLongitude) sethoroscopeFormData((prevData) => ({ ...prevData, longitude: resLongitude }));
    if (resLattitude) sethoroscopeFormData((prevData) => ({ ...prevData, latitude: resLattitude }));
  }, [searchParams]);

  useEffect(()=>{
    generateHoroscope();
  },[horoscope]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target;
    console.log("horoscopeFormData updated in handleChange:", horoscopeFormData); // Logging horoscopeFormData

    if (name === "major" || name === "minor") {
      // Mise à jour des niveaux d'aspect
      sethoroscopeFormData((prevState) => ({
        ...prevState,
        aspectLevels: {
          ...prevState.aspectLevels,
          [name]: checked,
        },
      }));
    } else if (name in horoscopeFormData.customOrbs) {
      // Mise à jour des orbes personnalisés
      sethoroscopeFormData((prevState) => ({
        ...prevState,
        customOrbs: {
          ...prevState.customOrbs,
          [name]: parseInt(value) || 0, // Convertir la valeur en nombre ou 0 par défaut
        },
      }));
    } else {
      // Mise à jour des autres champs du formulaire
      sethoroscopeFormData((prevState) => ({
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("horoscopeFormData submitted:", horoscopeFormData); // Logging horoscopeFormData

    // Valider que toutes les données nécessaires sont présentes dans horoscopeFormData
    const {
      date,
      time,
      latitude,
      longitude,
      houseSystem,
      zodiacSystem,
      language,
      aspectLevels,
      customOrbs,
    } = horoscopeFormData;
    if (
      !date ||
      !time ||
      !latitude ||
      !longitude ||
      !houseSystem ||
      !zodiacSystem ||
      !language
    ) {
      console.error("Toutes les données nécessaires ne sont pas remplies.");
      return;
    }

    // Créer une instance d'Origin
    const origin = new Origin({
      year: moment(date).year(),
      month: moment(date).month() + 1,
      date: moment(date).date(),
      hour: moment(time, "HH:mm:ss").hour(),
      minute: moment(time, "HH:mm:ss").minute(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });
    console.log("House System:", houseSystem);
    // Créer une instance d'Horoscope
    const horoscope = new Horoscope({
      origin: origin,
      houseSystem: houseSystem,
      zodiac: zodiacSystem,
      aspectTypes: (Object.keys(aspectLevels) as (keyof AspectLevels)[]).filter(
        (level) => aspectLevels[level],
      ),
      customOrbs: customOrbs,
      language: language,
    });
    setHoroscope(horoscope);
    
    // Appeler la fonction pour générer le diagramme horoscope
    generateHoroscope();

    // save horoscopeFormData in db
    // saveHoroscope(horoscopeFormData);
    // revalidatePath("/horoscope");
    // redirect("/horoscope");
  };

  const loadUI = () => {
    loadHouseSystemSelect();
    loadZodiacSystemSelect();
    loadAspectInputs();
  };

  const loadLanguageSelect = () => {
    // Load language options
  };

  const loadHouseSystemSelect = () => {
    // Load house system options based on language
  };

  const loadZodiacSystemSelect = () => {
    // Load zodiac system options based on language
  };

  const loadAspectInputs = () => {
    // Load aspect inputs based on language
  };

  const loadTableTitles = () => {
    // Load table titles based on language
    if (horoscope?._language) {
      Horoscope.ZodiacLabels(horoscope._language).forEach((zodiac, index) => {
        console.log(`"zodiac":${zodiac.label}, "index:" ${index + 1}`);
      });
    }
  };

  // Function to generate horoscope chart
  const generateHoroscope = () => {
    // Call necessary functions to generate horoscope chart
    if (horoscope) {
      console.log("::: Horoscope generated", horoscope);
      // console.log("CelestialBodies.all", horoscope.CelestialBodies);
      // console.log("CelestialBodies.all", horoscope.CelestialPoints);
      // console.log("CelestialBodies.all", horoscope.ZodiacCusps);
      const planets: Planets = {};
      horoscope.CelestialBodies.all.forEach((bodie:any)=>{
        // let label = bodie.label;
        const degrees = bodie.ChartPosition.Ecliptic.DecimalDegrees;
        planets[bodie.label] = [degrees];
      });
      const cusps = horoscope._houses.map((house:any) => house.ChartPosition.StartPosition.Ecliptic.DecimalDegrees);
      const dataForHoroscopeChart = {planets,cusps};
      console.log("::: dataForHoroscopeChart generated for triger SVG Chart",dataForHoroscopeChart);

      
      const chart = new Chart( 'paper', 800, 800);
        console.log(`CHART variable ::: `);
        //const t = JSON.stringify(chart);
        console.log(chart);
      const radix = chart.radix(dataForHoroscopeChart);
        console.log(`RADIX variable ::: `);
        console.log(radix);
        radix.aspects();
    }
    // Example: horoscope.generateChart()
  };

  // Additional DOM manipulation functions can go here

  return (
    <>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
          <div>
            <h1 className="text-3xl font-bold text-left mb-4">
              Ancestral Astrology Beta
            </h1>
            <h5 className="text-sm">
              A horoscope library for producing Kongo horoscope charts.
            </h5>
          </div>
          <form id="form" className="max-w-lg mx-auto" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div className="mb-4"> */}
            <MapboxSearchBox />
            <br/>
            {/* </div> */}
              <div className="mb-4">
                <label htmlFor="latitude" className="block">
                  Latitude (decimal)
                </label>
                <input
                  className="form-input text-black"
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  // defaultValue=""
                  value={horoscopeFormData.latitude}

                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="longitude" className="block">
                  Longitude (decimal)
                </label>
                <input
                  className="form-input text-black"
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  // defaultValue=""
                  value={horoscopeFormData.longitude}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="date" className="block">
                Date of birth
              </label>
              <input
                className="form-input text-black"
                id="date"
                name="date"
                type="date"
                defaultValue=""
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="time" className="block">
                Local Time of birth
              </label>
              <input
                className="form-input text-black"
                id="time"
                name="time"
                type="time"
                defaultValue=""
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="language" className="block">
                Language
              </label>
              <select
                id="language"
                name="language"
                className="form-select text-black"
                onChange={handleChange}
              >
                {/* <option value="">choose a language</option> */}
                <option value="en">anglais</option>
                <option value="fr">francais</option>
                <option value="kk">kikongo</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="zodiacSystem" className="block">
                Zodiac System:
              </label>
              <select
                id="zodiacSystem"
                name="zodiacSystem"
                onChange={handleChange}
                className="form-select text-black"
              >
                <option value="tropical">Tropical</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="houseSystem" className="block">
                House System:
              </label>
              <select
                id="houseSystem"
                name="houseSystem"
                onChange={handleChange}
                className="form-select text-black"
              >
                <option value="placidus">Placidus</option>
              </select>
            </div>
            <div className="mb-4">
              <fieldset className="block">Aspect Levels:</fieldset>
              <div className="space-y-2">
                <label htmlFor="major" className="flex items-center">

                  <input
                    id="major"
                    name="major"
                    type="checkbox"
                    className="form-checkbox mr-2 text-black"
                    defaultChecked={horoscopeFormData.aspectLevels.major} // Set defaultChecked based on initial state
                    onChange={handleChange}
                  />
                  <span>Major</span>
                </label>
                <label htmlFor="minor" className="flex items-center">
                  <input
                    id="minor"
                    name="minor"
                    type="checkbox"
                    className="form-checkbox mr-2 text-black"
                    defaultChecked={horoscopeFormData.aspectLevels.minor} // Set defaultChecked based on initial state
                    onChange={handleChange}
                  />
                  <span>Minor</span>
                </label>
              </div>
            </div>
            <fieldset className="block">Aspect Orbs:</fieldset>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">


              <div className="mb-4">
                <label htmlFor="orb_conjunction" className="block">
                  Conjunction
                </label>
                <input
                  className="form-input text-black"
                  id="orb_conjunction"
                  name="conjunction"
                  type="number"
                  min={0}
                  max={12}
                  onChange={handleChange}
                  defaultValue="0"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="orb_opposition" className="block">
                  Opposition
                </label>
                <input
                  className="form-input text-black"
                  id="orb_opposition"
                  name="opposition"
                  type="number"
                  min={0}
                  max={12}
                  onChange={handleChange}
                  defaultValue="0"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="orb_trine" className="block">
                  Trine
                </label>
                <input
                  className="form-input text-black"
                  id="orb_trine"
                  name="trine"
                  type="number"
                  min={0}
                  max={12}
                  onChange={handleChange}
                  defaultValue="0"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="orb_square" className="block">
                  Square
                </label>
                <input
                  className="form-input text-black"
                  id="orb_square"
                  name="square"
                  type="number"
                  min={0}
                  max={12}
                  onChange={handleChange}
                  defaultValue="0"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="orb_sextile" className="block">
                  Sextile
                </label>
                <input
                  className="form-input text-black"
                  id="orb_sextile"
                  name="sextile"
                  type="number"
                  min={0}
                  max={12}
                  onChange={handleChange}
                  defaultValue="0"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="orb_quincunx" className="block">
                  Quincunx
                </label>
                <input
                  className="form-input text-black"
                  id="orb_quincunx"
                  name="quincunx"
                  type="number"
                  min={0}
                  max={12}
                  onChange={handleChange}
                  defaultValue="0"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="orb_quintile" className="block">
                  Quintile
                </label>
                <input
                  className="form-input text-black"
                  id="orb_quintile"
                  name="quintile"
                  type="number"
                  min={0}
                  max={12}
                  onChange={handleChange}
                  defaultValue="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="orb_septile" className="block">
                  Septile
                </label>
                <input
                  className="form-input text-black"
                  id="orb_septile"
                  name="septile"
                  type="number"
                  min={0}
                  max={12}
                  onChange={handleChange}
                  defaultValue="0"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="orb_semi-square" className="block">
                  Semi-square
                </label>
                <input
                  className="form-input text-black"
                  id="orb_semi-square"
                  name="semi-square"
                  type="number"
                  min={0}
                  max={12}
                  onChange={handleChange}
                  defaultValue="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="orb_semi-sextile" className="block">
                  Semi-sextile
                </label>
                <input
                  className="form-input text-black"
                  id="orb_semi-sextile"
                  name="semi-sextile"
                  type="number"
                  min={0}
                  max={12}
                  onChange={handleChange}
                  defaultValue="0"
                />
              </div>
            </div>


            <div className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <fieldset className="block">Major Aspects:</fieldset>
                  <div id="major-aspect-inputs"></div>
                </div>
                <div>
                  <fieldset className="block">Minor Aspects:</fieldset>
                  <div id="minor-aspect-inputs"></div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>

            <small className="block mb-4">
              * Cooking up this beta version of Zola
            </small>
          </form>
        </div>
        <>
       
        {
            horoscope && 
            <>
                 <h2>Astro Chart</h2>
                {/* <div id="paper" min-height={400} min-width={400} onLoad={onLoad}></div> */}
                {/* <div id="paper" min-height={400} min-width={400}></div> */}
                <div id="paper"></div><script src="https://unpkg.com/@astrodraw/astrochart"></script>
            </>
            
        }
        
        </>
      </div>
    </>
  );
}
