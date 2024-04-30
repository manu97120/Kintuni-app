'use client'
// import Chart from '@astrodraw/astrochart';
// works too but generate 500 internal server error

import Chart from '@/app/lib/astroDraw'; 
// Works but with minor effect to check on module import/export
// Fixed in settings tsx file
import { useEffect } from 'react';

export default function AstroChart(){
    //data example
    const data = {
        "planets":{
        "Pluto":[63], 
        "Neptune":[110], 
        "Uranus":[318], 
        "Saturn":[201], 
        "Jupiter":[192], 
        "Mars":[210], 
        "Moon":[268], 
        "Sun":[281],
        "Mercury":[312], 
        "Venus":[330]},
        "cusps":[296, 350, 30, 56, 75, 94, 116, 170, 210, 236, 255, 274]          
    };

    useEffect(()=>{
        const chart = new Chart( 'paper', 800, 800);
        console.log(`CHART variable ::: `);
        console.log(chart);
        const radix = chart.radix(data);
        console.log(`RADIX variable ::: `);
        console.log(radix);
        radix.aspects();
    },[]);
  
    return (
        <>
        <h2>Astro Chart</h2>
        {/* <div id="paper" min-height={400} min-width={400} onLoad={onLoad}></div> */}
        {/* <div id="paper" min-height={400} min-width={400}></div> */}
        <div id="paper"></div>
        <script src="https://unpkg.com/@astrodraw/astrochart"></script>
        </>
    );
}