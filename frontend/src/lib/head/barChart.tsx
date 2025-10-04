import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  dataResponse: any;
}

export function BarChart({ dataResponse }: Props) {
  const labels = Array.from(
    new Set(
      dataResponse.map((item: any) =>
        new Date(item.dateTimeNow).toLocaleString("th-TH", { month: "long" })
      )
    )
  );

  // Count occurrences of each month
  const datasLow = labels.map(
    (month) =>
      dataResponse.filter(
        (item: any) =>
          item.options.priority === "low" &&
          new Date(item.dateTimeNow).toLocaleString("th-TH", {
            month: "long",
          }) === month &&
          new Date(item.dateTimeNow).getFullYear() === new Date().getFullYear()
      ).length
  );

  const datasMedium = labels.map(
    (month) =>
      dataResponse.filter(
        (item: any) =>
          item.options.priority === "medium" &&
          new Date(item.dateTimeNow).toLocaleString("th-TH", {
            month: "long",
          }) === month &&
          new Date(item.dateTimeNow).getFullYear() === new Date().getFullYear()
      ).length
  );

  const datasHigh = labels.map(
    (month) =>
      dataResponse.filter(
        (item: any) =>
          item.options.priority === "high" &&
          new Date(item.dateTimeNow).toLocaleString("th-TH", {
            month: "long",
          }) === month &&
          new Date(item.dateTimeNow).getFullYear() === new Date().getFullYear()
      ).length
  );

  const data = {
    labels: labels,
    datasets: [
      {
        label: "สูง",
        data: datasHigh,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        stack: "Stack 1",
      },
      {
        label: "ปานกลาง",
        data: datasMedium,
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        stack: "Stack 2",
      },
      {
        label: "ต่ำ",
        data: datasLow,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        stack: "Stack 3",
      },
    ],
  };

  const option = {
    plugins: {
      title: {
        display: false,
        text: "test",
      },
    },
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return <Bar options={option} data={data} />;
}
