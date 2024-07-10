'use client'
import { useState, useEffect } from "react";
import moment from "moment-timezone";
import { Origin, Horoscope } from "@/app/lib/circularNatalHoro";
import MapboxSearchBox from "@/app/ui/searchBox";
import AstroChart from "@/app/ui/astroChart";

// Define the type for custom orbs keys
type CustomOrbsKeys = 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile' | 'quincunx' | 'quintile' | 'septile' | 'semi-square' | 'semi-sextile';

interface AspectLevels {
  major: boolean;
  minor: boolean;
}

interface CustomOrbs {
  conjunction: number;
  opposition: number;
  trine: number;
  square: number;
  sextile: number;
  quincunx: number;
  quintile: number;
  septile: number;
  "semi-square": number;
  "semi-sextile": number;
}

// Define the type for the `planets` object
interface Planets {
  [key: string]: number[]; // Assuming degrees are stored as an array of numbers
}

export default function HoroForm({
    searchParams,
  }: {
    searchParams?: {
      addressQuery?: string;
      longitude?: string;
      latitude?: string;
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
        } as CustomOrbs,
      });
    
      const [horoscope, setHoroscope] = useState<Horoscope | null>(null);
      const [dataForHoroscopeChart, setDataForHoroscopeChart] = useState<{ planets: Planets; cusps: number[] } | null>(null);
    
      useEffect(() => {
    
          loadLanguageSelect();
          loadUI();
    
      }, []);
    
      useEffect(() => {
        loadTableTitles();
      }, [horoscopeFormData.language]);
    
      // Function to update form data from URL params
      useEffect(() => {
        if (searchParams) {
          const resLongitude = searchParams?.longitude;
          const resLattitude = searchParams?.latitude;
    
          if (resLongitude) sethoroscopeFormData((prevData) => ({ ...prevData, longitude: resLongitude }));
          if (resLattitude) sethoroscopeFormData((prevData) => ({ ...prevData, latitude: resLattitude }));
          console.log("::: useEffect searchParams for resL update horoscopeFormData:", horoscopeFormData);
        }
      }, [searchParams]);
    
      useEffect(() => {
        generateHoroscope();
      }, [horoscope]);
    
      useEffect(() => {
        if (dataForHoroscopeChart) {
          console.log("::: dataForHoroscopeChart fom Horo page updated generated to send to AstroChart2 child component for triger SVG Chart:", dataForHoroscopeChart);
    
        }
      }, [dataForHoroscopeChart]);
    
      const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      ) => {
        const { name, value, type } = e.target as HTMLInputElement; // Explicitly type the event target to HTMLInputElement
    
        if (type === "checkbox") {
          const checked = (e.target as HTMLInputElement).checked;
          sethoroscopeFormData((prevState) => ({
            ...prevState,
            aspectLevels: {
              ...prevState.aspectLevels,
              [name]: checked,
            },
          }));
        } else if (name in horoscopeFormData.customOrbs) {
          sethoroscopeFormData((prevState) => ({
            ...prevState,
            customOrbs: {
              ...prevState.customOrbs,
              [name]: parseInt(value) || 0,
            },
          }));
        } else {
          sethoroscopeFormData((prevState) => ({
            ...prevState,
            [name]: value,
          }));
        }

        // console.log("handleChange check object:",horoscopeFormData);
        
      };
    
      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("horoscopeFormData submitted:", horoscopeFormData); // Logging horoscopeFormData
    
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
    
        const origin = new Origin({
          year: moment(date).year(),
          month: moment(date).month(),
          date: moment(date).date(),
          hour: moment(time, "HH:mm:ss").hour(),
          minute: moment(time, "HH:mm:ss").minute(),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        });
    
        console.log("House System:", houseSystem);
    
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
        generateHoroscope();
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
    
      const generateHoroscope = () => {
        if ( horoscope) {
          console.log("::: Horoscope generated", horoscope);
          const planets: Planets = {};
          horoscope.CelestialBodies.all.forEach((bodie: any) => {
            const degrees = bodie.ChartPosition.Ecliptic.DecimalDegrees;
            planets[bodie.label] = [degrees];
          });
          const cusps = horoscope._houses.map((house: any) => house.ChartPosition.StartPosition.Ecliptic.DecimalDegrees);
          const dataForHoroscopeChart0 = { planets, cusps };
          setDataForHoroscopeChart(dataForHoroscopeChart0);
          // console.log("::: dataForHoroscopeChart0 generated for triger SVG Chart", dataForHoroscopeChart0);
      
        }
      };

    return (
        <>
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
                        <MapboxSearchBox />
                        <br />
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
                                value={horoscopeFormData.latitude}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="longitude" className="block ">
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
                            value={horoscopeFormData.date}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="time" className="block">
                            Time of birth (24-hour format)
                        </label>
                        <input
                            className="form-input text-black"
                            id="time"
                            name="time"
                            type="time"
                            value={horoscopeFormData.time}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="houseSystem" className="block">
                            House System
                        </label>
                        <select
                            className="form-select text-black"
                            id="houseSystem"
                            name="houseSystem"
                            value={horoscopeFormData.houseSystem}
                            onChange={handleChange}
                        >
                            <option value="placidus">Placidus</option>
                            <option value="koch">Koch</option>
                            <option value="equal">Equal</option>
                            <option value="whole-sign">Whole Sign</option>
                            {/* Add more house systems as needed */}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="zodiacSystem" className="block">
                            Zodiac System
                        </label>
                        <select
                            className="form-select text-black"
                            id="zodiacSystem"
                            name="zodiacSystem"
                            value={horoscopeFormData.zodiacSystem}
                            onChange={handleChange}
                        >
                            <option value="tropical">Tropical</option>
                            <option value="sidereal">Sidereal</option>
                            {/* Add more zodiac systems as needed */}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="language" className="block">
                            Language
                        </label>
                        <select
                            className="form-select text-black"
                            id="language"
                            name="language"
                            value={horoscopeFormData.language}
                            onChange={handleChange}
                        >
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                            <option value="kk">Kikongo</option>
                            {/* Add more languages as needed */}
                        </select>
                    </div>
                    <div className="mb-4">
                        <fieldset className="block">
                            Aspect Levels
                        </fieldset>
                        <div className="flex items-center">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    name="major"
                                    checked={horoscopeFormData.aspectLevels.major}
                                    onChange={handleChange}
                                />
                                <span className="ml-2">Major</span>
                            </label>
                            <label className="inline-flex items-center ml-4">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    name="minor"
                                    checked={horoscopeFormData.aspectLevels.minor}
                                    onChange={handleChange}
                                />
                                <span className="ml-2">Minor</span>
                            </label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <fieldset className="block">
                            Custom Orbs (degrees)
                        </fieldset>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.keys(horoscopeFormData.customOrbs).map((aspect) => (
                                <div key={aspect}>
                                    <label htmlFor={aspect} className="block capitalize">
                                        {aspect}
                                    </label>
                                    <input
                                        className="form-input text-black"
                                        id={aspect}
                                        name={aspect}
                                        type="number"
                                        value={horoscopeFormData.customOrbs[aspect as CustomOrbsKeys]} // Safely index with the defined type
                                        onChange={handleChange}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                        type="submit"
                    >
                        Generate Horoscope
                    </button>
                </form>
            </div>
            <AstroChart dataReceiveForHoroChart={dataForHoroscopeChart}/>
        </>);
}