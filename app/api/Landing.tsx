// /app/api/Landing.tsx
'use client'
import { useState, useEffect } from "react";
import moment from "moment-timezone";
import { Origin, Horoscope } from "@/app/lib/circularNatalHoro";
import AstroChart from "@/app/ui/astroChart";
import './Landing.css';
import Loader from "@/app/ui/Loader";
import { fetchAIAnalysis } from "@/app/lib/openai";

// Define the type for custom orbs keys
type CustomOrbsKeys = 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile' | 'quincunx' | 'quintile' | 'septile' | 'semi-square' | 'semi-sextile';

interface Planets {
  [key: string]: number[]; // Assuming degrees are stored as an array of numbers
}

export default function Landing() {
  const [horoscopeFormData, setHoroscopeFormData] = useState({
    date: moment().format("YYYY-MM-DD"),
    time: moment().format("HH:mm:00"),
    latitude: "48.8575",
    longitude: "2.3514",
    email: ""
  });

  const [horoscope, setHoroscope] = useState<Horoscope | null>(null);
  const [dataForHoroscopeChart, setDataForHoroscopeChart] = useState<{ planets: Planets; cusps: number[] } | null>(null);
  const [analysisText, setAnalysisText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Générer le horoscope par défaut lors du montage du composant
    generateHoroscope();
  }, []);

  useEffect(() => {
    if (dataForHoroscopeChart) {
      console.log("Data for Horoscope Chart updated:", dataForHoroscopeChart);
    }
  }, [dataForHoroscopeChart]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHoroscopeFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Horoscope form data submitted:", horoscopeFormData);

    const { date, time, latitude, longitude, email } = horoscopeFormData;
    if (!date || !time || !latitude || !longitude) {
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

    const horoscope = new Horoscope({
      origin: origin,
      houseSystem: "placidus",
      zodiac: "tropical",
      aspectTypes: ["conjunction", "opposition", "trine", "square", "sextile"], // Example aspects
      customOrbs: {
        conjunction: 10,
        opposition: 10,
        trine: 10,
        square: 10,
        sextile: 10,
        quincunx: 10,
        quintile: 10,
        septile: 10,
        "semi-square": 10,
        "semi-sextile": 10,
      },
      language: "en",
    });

    setHoroscope(horoscope);
    generateHoroscope(horoscope);
    await generateAIAnalysis();

    try {
      const response = await fetch('/api/save-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, time, latitude, longitude, email }),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error("Erreur lors de l'insertion dans la base de données:", error);
    }
  };

  const generateHoroscope = (horoscopeInstance?: Horoscope) => {
    const horoscopeToUse = horoscopeInstance || new Horoscope({
      origin: new Origin({
        year: moment().year(),
        month: moment().month(),
        date: moment().date(),
        hour: moment().hour(),
        minute: moment().minute(),
        latitude: 48.8575,
        longitude: 2.3514,
      }),
      houseSystem: "placidus",
      zodiac: "tropical",
      aspectTypes: ["conjunction", "opposition", "trine", "square", "sextile"],
      customOrbs: {
        conjunction: 10,
        opposition: 10,
        trine: 10,
        square: 10,
        sextile: 10,
        quincunx: 10,
        quintile: 10,
        septile: 10,
        "semi-square": 10,
        "semi-sextile": 10,
      },
      language: "en",
    });

    setHoroscope(horoscopeToUse);

    if (horoscopeToUse) {
      console.log("Horoscope generated:", horoscopeToUse);
      const planets: Planets = {};
      horoscopeToUse.CelestialBodies.all.forEach((bodie: any) => {
        const degrees = bodie.ChartPosition.Ecliptic.DecimalDegrees;
        planets[bodie.label] = [degrees];
      });
      const cusps = horoscopeToUse._houses.map((house: any) => house.ChartPosition.StartPosition.Ecliptic.DecimalDegrees);
      const dataForHoroscopeChart0 = { planets, cusps };
      setDataForHoroscopeChart(dataForHoroscopeChart0);
    }
  };

  const generateAIAnalysis = async () => {
    setLoading(true);
    try {
      console.log("Fetching AI analysis...");
      const analysis = await fetchAIAnalysis(horoscopeFormData);
      console.log("Received AI analysis:", analysis);
      setAnalysisText(analysis);
    } catch (error) {
      console.error("Erreur lors de la génération de l'analyse:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header>
        <h1>KintuniAI</h1>
        <p className="tagline">L'application pour découvrir son chemin de vie</p>
      </header>
      <div className="container">
        <div className="chart-container">
          <div className="left-column">
            <div className="chart-section">
              <form id="form" onSubmit={handleSubmit}>
                <div className="input-phrase">
                Vous êtes nés à <input type="text" id="birthplace" placeholder="Ville de naissance" name="birthplace" required />
                  le <input type="date" id="birthdate" name="date" value={horoscopeFormData.date} onChange={handleChange} required />
                  à <input type="time" id="birthtime" name="time" value={horoscopeFormData.time} onChange={handleChange} required />
                  Mon email: <input type="email" id="email" placeholder="votre@email.com (facultatif)" name="email" />
                  <input type="hidden" name="latitude" value={horoscopeFormData.latitude} onChange={handleChange} />
                  <input type="hidden" name="longitude" value={horoscopeFormData.longitude} onChange={handleChange} />
                </div>
                <button type="submit">Genérer Mon Thème Kintuni</button>
              </form>
              <p className="email-notice"> Renseignez votre email pour générer l'analyse de votre axe de vie personnalisée grâce à notre IA, et être informé de nos innovations à venir par newsletter.</p>
            </div>
            <div className="analysis-section">
              <h2>Votre analyse personnalisée:</h2>
              {loading ? <Loader /> : <p id="analysis-text">{analysisText || "L'axe de vie représente ....."}</p>}
            </div>
            <a href="#book-appointment" className="cta-button">Découvrez en plus avec nos pratitiens</a>
          </div>
          <div className="right-column">
            <div className="chart-section">
              <AstroChart dataReceiveForHoroChart={dataForHoroscopeChart} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}