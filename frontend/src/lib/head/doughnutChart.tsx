import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  dataResponse: any;
}

export function Doughnuts({ dataResponse }: Props) {
  const datasLow = dataResponse.filter(
    (item: any) => item.options.priority === "low"
  ).length;

  const datasMedium = dataResponse.filter(
    (item: any) => item.options.priority === "medium"
  ).length;

  const datasHigh = dataResponse.filter(
    (item: any) => item.options.priority === "high"
  ).length;

  const data = {
    labels: ["สูง", "ปานกลาง", "ต่ำ"],
    datasets: [
      {
        label: "จำนวนภาระงานทั้งหมด",
        data: [datasHigh, datasMedium, datasLow],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      <Doughnut
        data={data}
        options={{
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        }}
      />
    </>
  );
}
