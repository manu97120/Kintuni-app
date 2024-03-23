const express = require('express');
const { Origin, Horoscope } = require('circular-natal-horoscope-js');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());
/*app.use(cors({
    origin: 'https://maatik.xyz/'
  }));*/

// Store the last generated horoscope in memory
let lastHoroscope = null;

app.get('/horoscope', (req, res) => {
    const { year, month, day, hour, minute, latitude, longitude } = req.query;
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
        aspectTypes: ["conjunction","opposition","trine","square","sextile","semi-sextile"],

    });
    
    // Store the generated horoscope
    lastHoroscope = horoscope;
    
    res.json(horoscope);



//CONDITION SI Né SOUS L'EQUATEUR
app.get('/config', (req, res) => {
    if (!lastHoroscope) {
        return res.status(404).send('No horoscope data available.');
    }
    let useNatalChart2 = lastHoroscope.origin.latitude < 0 ? 'inverse' : 'ok';    
    res.json({ useNatalChart2 });
});

    
});


//NATAL CHART 
app.get('/natalchart', (req, res) => {
    

    // Préparez les données des planètes
    const planets = {};
    lastHoroscope._celestialBodies.all.forEach(body => {
        const degrees = body.ChartPosition.Ecliptic.DecimalDegrees;
        planets[body.label] = [degrees];
    });

    let cusps = lastHoroscope._houses.map(house => house.ChartPosition.StartPosition.Ecliptic.DecimalDegrees);

    const astroChartJson = {
        planets: planets,
        cusps: cusps
    };

    res.json(astroChartJson);
});
        


//});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



