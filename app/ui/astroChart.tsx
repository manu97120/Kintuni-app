"use client";
import { useEffect } from "react";
import Chart from "@/app/lib/astroDraw";

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

export default function AstroChart({
  dataReceiveForHoroChart,
}: AstroChartProps) {
  useEffect(() => {
    if (dataReceiveForHoroChart) {
      console.log(
        "::: dataReceiveForHoroChart for triger SVG Chart:",
        dataReceiveForHoroChart,
      );

      const settings = {
        //SYMBOL_SCALE: 1.25,
        PADDING: 30,

        INNER_CIRCLE_RADIUS_RATIO: 5,
        INDOOR_CIRCLE_RADIUS_RATIO: 2.2,
        //COLOR_BACKGROUND: "#F5F5DC",
        //POINTS_COLOR: "#FF7700",
        POINTS_TEXT_SIZE: 10,
        POINTS_STROKE: 2,
        SYMBOL_AXIS_FONT_COLOR: "#D3D3D3",
        SYMBOL_AXIS_STROKE: 1,
        //SIGNS_COLOR: "#808080",
        //CIRCLE_COLOR: "#FF7700",
        //CIRCLE_STRONG: 3,
        //LINE_COLOR: "#FF7700",
        CUSPS_FONT_COLOR: "#808080",
        CUSPS_STROKE: 1,
        STROKE_ONLY: false,
        //MARGIN: 100,
        SHOW_DIGNITIES_TEXT: false,
        ASPECTS: {
          conjunction: { degree: 0, orbit: 10, color: "transparent" },
          square: { degree: 90, orbit: 8, color: "#FF4500" },
          trine: { degree: 120, orbit: 8, color: "#27AE60" },
          opposition: { degree: 180, orbit: 10, color: "#696969" },
          sextile: { degree: 60, orbit: 10, color: "#0000CD" }, // couleur à changer
          semisextile: { degree: 30, orbit: 10, color: "#89E0FF" }, // couleur à changer
        },
        COLORS_SIGNS: [
          "#F08080",
          "#F5F5DC",
          "#F0FFF0",
          "#E0FFFF",
          "#F08080",
          "#F5F5DC",
          "#F0FFF0",
          "#E0FFFF",
          "#F08080",
          "#F5F5DC",
          "#F0FFF0",
          "#E0FFFF",
        ],
      };
      const chart = new Chart("paper", 800, 800, settings);
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
