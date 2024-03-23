// import Chart from '@astrodraw/astrochart';
export default function AstroChart(){
    // const chart = new Chart( 'paper', 800, 800);

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
  
    // const radix = chart.radix( data );
  
    return (
        <>
        <h2>Astro Chart</h2>
        <div id="paper"></div>
        <script src="https://unpkg.com/@astrodraw/astrochart"></script>
        </>
    );
}