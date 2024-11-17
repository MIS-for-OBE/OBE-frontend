import { calStat, generateBellCurveData } from "@/helpers/functions/score";
import { IModelAssignment, IModelScore } from "@/models/ModelCourse";
import { IModelUser } from "@/models/ModelUser";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
} from "chart.js";
import { useEffect, useRef } from "react";
import { CategoryScale } from "chart.js";
import "chart.js/auto";
Chart.register(CategoryScale);

Chart.register(LineController, LineElement, PointElement, LinearScale, Title);

type Props = {
  mean: number;
  sd: number;
  fullScore: number;
};

export default function Curve({ mean, sd, fullScore }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      if (ctx) {
        const bellCurveData = generateBellCurveData(mean, sd, fullScore);
        chartInstanceRef.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: bellCurveData.map((point) => point.x.toFixed(2)),
            datasets: [
              {
                data: bellCurveData.map((point) => point.y),
                borderColor: "rgba(31, 105, 243, 1)",
                backgroundColor: "rgba(31, 105, 243, 0.1)",
                borderWidth: 2,
                fill: true,
                pointRadius: 0,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Score",
                },
                type: "linear",
                min: 0,
                max: fullScore,
                ticks: {
                  stepSize: 1,
                  autoSkip: false,
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Density",
                },
              },
            },
          },
        });
      }
    }
  }, [mean, sd]);

  return <canvas ref={chartRef} id="myChart"></canvas>;
}