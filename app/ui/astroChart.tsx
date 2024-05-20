'use client'
import { useEffect } from 'react';
import Chart from '@/app/lib/astroDraw';

// Define the types for the props
interface Planets {
  [key: string]: number[];
}

interface DataForHoroscopeChart {
  planets: Planets;
  cusps: number[];
}

interface AstroChartProps {
  dataReceiveForHoroChart: DataForHoroscopeChart | null;
}

export default function AstroChart({ dataReceiveForHoroChart }: AstroChartProps) {
  useEffect(() => {
    if (dataReceiveForHoroChart) {
      console.log("::: dataReceiveForHoroChart for triger SVG Chart:", dataReceiveForHoroChart);

      const chart = new Chart('paper', 800, 800);
      const radix = chart.radix(dataReceiveForHoroChart);
      radix.aspects();
    }
  }, [dataReceiveForHoroChart]);

  return (
    <>
      {dataReceiveForHoroChart && (
        <>
          <h2>Astro Chart</h2>
          <div id="paper"></div>
        </>
      )}
    </>
  );
}
