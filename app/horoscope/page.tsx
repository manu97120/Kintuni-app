'use client'
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { Chart } from '@astrodraw/astrochart';
import { Origin, Horoscope } from "circular-natal-horoscope-js";

interface AspectLevels {
    major: boolean;
    minor: boolean;
}

export default function HoroscopePage() {
    const [formData, setFormData] = useState({
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HH:mm:00'),
        latitude: '',
        longitude: '',
        houseSystem: 'placidus',
        zodiacSystem: 'tropical',
        language: 'en',
        aspectLevels: {
            major: true,
            minor: true
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
            'semi-square': 0,
            'semi-sextile': 0
        }
    });

    useEffect(() => {
        loadLanguageSelect();
        loadUI();
    }, []);

    useEffect(() => {
        loadTableTitles();
    }, [formData.language]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
    const { date, time, latitude, longitude, houseSystem, zodiacSystem, language, aspectLevels, customOrbs } = formData;
    
        // Create an Origin instance
        const origin = new Origin({
            year: moment(date).year(),
            month: moment(date).month() + 1, // Moment month is 0-indexed
            date: moment(date).date(),
            hour: moment(time, 'HH: ki mm:ss').hour(),
            minute: moment(time, 'HH:mm:ss').minute(),
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
        });

        // Create a Horoscope instance
        const horoscope = new Horoscope({
            origin: origin,
            houseSystem: houseSystem,
            zodiac: zodiacSystem,
            aspectTypes: (Object.keys(formData.aspectLevels) as (keyof AspectLevels)[])
                .filter(level => formData.aspectLevels[level]),
            customOrbs: customOrbs,
            language: language
        });

        // Call the function to generate the horoscope chart
        generateHoroscope(horoscope);
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
    };

    // Function to generate horoscope chart
    const generateHoroscope = (horoscope: Horoscope) => {
        // Call necessary functions to generate horoscope chart
        // Example: horoscope.generateChart()
    };

    // Additional DOM manipulation functions can go here

    return (
        <>
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
                    <div>
                        <h1 className="text-3xl font-bold text-left mb-4">Ancestral Astrology Beta</h1>
                        <h5 className="text-sm">A horoscope library for producing Kongo horoscope charts.</h5>
                    </div>
                    <form id="form" className="max-w-lg mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label htmlFor="latitude" className="block">Latitude (decimal)</label>
                                <input className="form-input text-black" id="latitude" name="latitude" type="number" step="any" min="-90" max="90" defaultValue="42.37" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="longitude" className="block">Longitude (decimal)</label>
                                <input className="form-input text-black" id="longitude" name="longitude" type="number" step="any" min="-180" max="180" defaultValue="-71.11" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="date" className="block">Date of birth</label>
                            <input className="form-input text-black" id="date" name="date" type="date" defaultValue="1981-07-13" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="time" className="block">Local Time of birth</label>
                            <input className="form-input text-black" id="time" name="time" type="time" defaultValue="11:22:00" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="language-select" className="block">Language</label>
                            <select id="language-select" className="form-select text-black">
                                {/* <option value="">choose a language</option> */}
                                <option value="en">anglais</option>
                                <option value="fr">francais</option>
                                <option value="kk">kikongo</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="zodiacSystem" className="block">Zodiac System:</label>
                            <select id="zodiacSystem" className="form-select text-black">
                                <option value="Tropical">Tropical</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="houseSystem" className="block">House System:</label>
                            <select id="houseSystem" className="form-select text-black">
                                <option value="Placidius">Placidius</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block">Aspect Levels:</label>
                            <div className="space-y-2">
                                <label htmlFor="aspect-level-major" className="flex items-center">
                                    <input id="aspect-level-major" name="aspect-level-major" type="checkbox" className="form-checkbox mr-2 text-black" defaultChecked />
                                    <span>Major</span>
                                </label>
                                <label htmlFor="aspect-level-minor" className="flex items-center">
                                        <input id="aspect-level-minor" name="aspect-level-minor" type="checkbox" className="form-checkbox mr-2 text-black" />
                                    <span>Minor</span>
                                </label>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block">Aspect Orbs:</label>
                        
                            <label htmlFor="conjunction" className="block">Conjunction</label>
                            <input className="form-input text-black" id="conjunction" name="conjunction" type="number" defaultValue="0" />
                            <label htmlFor="opposition" className="block">Opposition</label>
                            <input className="form-input text-black" id="opposition" name="opposition" type="number" defaultValue="0" />
                            <label htmlFor="trine" className="block">Trine</label>
                            <input className="form-input text-black" id="trine" name="trine" type="number" defaultValue="0" />
                            <label htmlFor="square" className="block">Square</label>
                            <input className="form-input text-black" id="square" name="square" type="number" defaultValue="0" />
                            <label htmlFor="sextile" className="block">Sextile</label>
                            <input className="form-input text-black" id="sextile" name="sextile" type="number" defaultValue="0" />
                            <label htmlFor="quincunx" className="block">Quincunx</label>
                            <input className="form-input text-black" id="quincunx" name="quincunx" type="number" defaultValue="0" />
                            <label htmlFor="quintile" className="block">Quintile</label>
                            <input className="form-input text-black" id="quintile" name="quintile" type="number" defaultValue="0" />
                            <label htmlFor="septile" className="block">Septile</label>
                            <input className="form-input text-black" id="septile" name="septile" type="number" defaultValue="0" />
                            <label htmlFor="semi-square" className="block">Semi-square</label>
                            <input className="form-input text-black" id="semi-square" name="semi-square" type="number" defaultValue="0" />
                            <label htmlFor="semi-sextile" className="block">Semi-sextile</label>
                            <input className="form-input text-black" id="semi-sextile" name="semi-sextile" type="number" defaultValue="0" />
                        </div>
                        <div className="mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block">Major Aspects:</label>
                                    <div id="major-aspect-inputs"></div>
                                </div>
                                <div>
                                    <label className="block">Minor Aspects:</label>
                                    <div id="minor-aspect-inputs"></div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Submit
                        </button>

                        <small className="block mb-4">* Cooking up this beta version of Zola</small>
                    </form>
                    <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2">
                    <div className="form-group">
                        <label htmlFor="sunsign">Sun sign:</label>
                        <p id="sunsign"></p>
                    </div>
                    <div className="form-group">
                        <label>Angles: </label>
                        <table id="angles" className="table table-dark">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>ascendant</th>
                                    <th>m.c.</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Horizon Degrees</td>
                                    <td id="ascendant-a"></td>
                                    <td id="midheaven-a"></td>
                                </tr>
                                <tr>
                                    <td>Ecliptic Degrees</td>
                                    <td id="ascendant-b"></td>
                                    <td id="midheaven-b"></td>
                                </tr>
                                <tr>
                                    <td>Sign - D/M/S</td>
                                    <td id="ascendant-c"></td>
                                    <td id="midheaven-c"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <hr className="my-4 border-t-1 border-gray-400" />
                    <div className="form-group">
                        <label htmlFor="zodiacCusps">Zodiac Cusps:</label>
                        <table id="zodiacCusps" className="table table-dark">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Aries</th>
                                    <th>Taurus</th>
                                    <th>Gemini</th>
                                    <th>Cancer</th>
                                    <th>Leo</th>
                                    <th>Virgo</th>
                                    <th>Libra</th>
                                    <th>Scorpio</th>
                                    <th>Sagittarius</th>
                                    <th>Capricorn</th>
                                    <th>Aquarius</th>
                                    <th>Pisces</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Horizon Degrees</td>
                                    <td id="zodiac-1"></td>
                                    <td id="zodiac-2"></td>
                                    <td id="zodiac-3"></td>
                                    <td id="zodiac-4"></td>
                                    <td id="zodiac-5"></td>
                                    <td id="zodiac-6"></td>
                                    <td id="zodiac-7"></td>
                                    <td id="zodiac-8"></td>
                                    <td id="zodiac-9"></td>
                                    <td id="zodiac-10"></td>
                                    <td id="zodiac-11"></td>
                                    <td id="zodiac-12"></td>
                                </tr>
                                <tr>
                                    <td>Ecliptic Degrees</td>
                                    <td id="zodiac-1b"></td>
                                    <td id="zodiac-2b"></td>
                                    <td id="zodiac-3b"></td>
                                    <td id="zodiac-4b"></td>
                                    <td id="zodiac-5b"></td>
                                    <td id="zodiac-6b"></td>
                                    <td id="zodiac-7b"></td>
                                    <td id="zodiac-8b"></td>
                                    <td id="zodiac-9b"></td>
                                    <td id="zodiac-10b"></td>
                                    <td id="zodiac-11b"></td>
                                    <td id="zodiac-12b"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="w-full md:w-1/2">
                    <div className="form-group">
                        <label htmlFor="houses">Houses:</label>
                        <table id="houses" className="table table-dark">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>House 1</th>
                                    <th>House 2</th>
                                    <th>House 3</th>
                                    <th>House 4</th>
                                    <th>House 5</th>
                                    <th>House 6</th>
                                    <th>House 7</th>
                                    <th>House 8</th>
                                    <th>House 9</th>
                                    <th>House 10</th>
                                    <th>House 11</th>
                                    <th>House 12</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Horizon Degrees</td>
                                    <td id="house-1a"></td>
                                    <td id="house-2a"></td>
                                    <td id="house-3a"></td>
                                    <td id="house-4a"></td>
                                    <td id="house-5a"></td>
                                    <td id="house-6a"></td>
                                    <td id="house-7a"></td>
                                    <td id="house-8a"></td>
                                    <td id="house-9a"></td>
                                    <td id="house-10a"></td>
                                    <td id="house-11a"></td>
                                    <td id="house-12a"></td>
                                </tr>
                                <tr>
                                    <td>Ecliptic Degrees</td>
                                    <td id="house-1b"></td>
                                    <td id="house-2b"></td>
                                    <td id="house-3b"></td>
                                    <td id="house-4b"></td>
                                    <td id="house-5b"></td>
                                    <td id="house-6b"></td>
                                    <td id="house-7b"></td>
                                    <td id="house-8b"></td>
                                    <td id="house-9b"></td>
                                    <td id="house-10b"></td>
                                    <td id="house-11b"></td>
                                    <td id="house-12b"></td>
                                </tr>
                                <tr>
                                    <td>Sign</td>
                                    <td id="house-1-sign"></td>
                                    <td id="house-2-sign"></td>
                                    <td id="house-3-sign"></td>
                                    <td id="house-4-sign"></td>
                                    <td id="house-5-sign"></td>
                                    <td id="house-6-sign"></td>
                                    <td id="house-7-sign"></td>
                                    <td id="house-8-sign"></td>
                                    <td id="house-9-sign"></td>
                                    <td id="house-10-sign"></td>
                                    <td id="house-11-sign"></td>
                                    <td id="house-12-sign"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <hr className="my-4 border-t-1 border-gray-400" />
                    <div className="form-group">
                        <label htmlFor="bodies">Celestial Bodies:</label>
                        <table id="bodies" className="table table-dark">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>sun</th>
                                    <th>moon</th>
                                    <th>mercury</th>
                                    <th>venus</th>
                                    <th>mars</th>
                                    <th>jupiter</th>
                                    <th>saturn</th>
                                    <th>uranus</th>
                                    <th>neptune</th>
                                    <th>pluto</th>
                                    <th>chiron</th>
                                    <th>sirius</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Horizon Degrees</td>
                                    <td id="sun-a"></td>
                                    <td id="moon-a"></td>
                                    <td id="mercury-a"></td>
                                    <td id="venus-a"></td>
                                    <td id="mars-a"></td>
                                    <td id="jupiter-a"></td>
                                    <td id="saturn-a"></td>
                                    <td id="uranus-a"></td>
                                    <td id="neptune-a"></td>
                                    <td id="pluto-a"></td>
                                    <td id="chiron-a"></td>
                                    <td id="sirius-a"></td>
                                </tr>
                                <tr>
                                    <td>Ecliptic Degrees</td>
                                    <td id="sun-b"></td>
                                    <td id="moon-b"></td>
                                    <td id="mercury-b"></td>
                                    <td id="venus-b"></td>
                                    <td id="mars-b"></td>
                                    <td id="jupiter-b"></td>
                                    <td id="saturn-b"></td>
                                    <td id="uranus-b"></td>
                                    <td id="neptune-b"></td>
                                    <td id="pluto-b"></td>
                                    <td id="chiron-b"></td>
                                    <td id="sirius-b"></td>
                                </tr>
                                <tr>
                                    <td>Sign</td>
                                    <td id="sun-c"></td>
                                    <td id="moon-c"></td>
                                    <td id="mercury-c"></td>
                                    <td id="venus-c"></td>
                                    <td id="mars-c"></td>
                                    <td id="jupiter-c"></td>
                                    <td id="saturn-c"></td>
                                    <td id="uranus-c"></td>
                                    <td id="neptune-c"></td>
                                    <td id="pluto-c"></td>
                                    <td id="chiron-c"></td>
                                    <td id="sirius-c"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
                </div>
                

            </div>
            


        </>
    );
}

