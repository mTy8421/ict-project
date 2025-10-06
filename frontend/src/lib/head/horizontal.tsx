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

export function Horizontal({ dataResponse }: Props) {
  const options = {
    indexAxis: "y" as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      //   title: {
      //     display: true,
      //     text: "Chart.js Horizontal Bar Chart",
      //   },
    },
  };

  const labels = Array.from(
    new Set(
      dataResponse.map((item: any) =>
        new Date(item.dateTimeNow).toLocaleString("th-TH", { month: "long" })
      )
    )
  );

  const datasGeneralAdministration = labels.map(
    (month) =>
      dataResponse.filter(
        (item: any) =>
          item.user.user_role === "พนักงานฝ่ายบริหารทั่วไป" &&
          new Date(item.dateTimeNow).toLocaleString("th-TH", {
            month: "long",
          }) === month &&
          new Date(item.dateTimeNow).getFullYear() === new Date().getFullYear()
      ).length
  );

  const datasAcademic = labels.map(
    (month) =>
      dataResponse.filter(
        (item: any) =>
          item.user.user_role === "พนักงานฝ่ายวิชาการ" &&
          new Date(item.dateTimeNow).toLocaleString("th-TH", {
            month: "long",
          }) === month &&
          new Date(item.dateTimeNow).getFullYear() === new Date().getFullYear()
      ).length
  );

  const datasPlan = labels.map(
    (month) =>
      dataResponse.filter(
        (item: any) =>
          item.user.user_role === "พนักงานฝ่ายแผนงาน" &&
          new Date(item.dateTimeNow).toLocaleString("th-TH", {
            month: "long",
          }) === month &&
          new Date(item.dateTimeNow).getFullYear() === new Date().getFullYear()
      ).length
  );

  const datasDevelopDigitalSkills = labels.map(
    (month) =>
      dataResponse.filter(
        (item: any) =>
          item.user.user_role === "พนักงานฝ่ายพัฒนาทักษะดิจิทัล" &&
          new Date(item.dateTimeNow).toLocaleString("th-TH", {
            month: "long",
          }) === month &&
          new Date(item.dateTimeNow).getFullYear() === new Date().getFullYear()
      ).length
  );

  const data = {
    labels,
    datasets: [
      {
        label: "พนักงานฝ่ายบริหารทั่วไป",
        data: datasGeneralAdministration,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "พนักงานฝ่ายวิชาการ",
        data: datasAcademic,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
      {
        label: "พนักงานฝ่ายแผนงาน",
        data: datasPlan,
        borderColor: "rgb(255, 206, 86)",
        backgroundColor: "rgba(255, 206, 86, 0.5)",
      },
      {
        label: "พนักงานฝ่ายพัฒนาทักษะดิจิทัล",
        data: datasDevelopDigitalSkills,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
