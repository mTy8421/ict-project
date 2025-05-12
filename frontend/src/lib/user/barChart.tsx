import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  plugins: {
    title: {
      display: false,
      text: 'test',
    },
  },
  responsive: true,
  interaction: {
    mode: 'index' as const,
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

const labels = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const datas = [10, 20, 30, 40, 50, 60, 70, 30, 40, 50, 60, 70];

const data = {
  labels,
  datasets: [
    {
      label: 'จำนวนภาระงาน',
      // data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      data: datas,
      backgroundColor: 'rgb(255, 99, 132)',
      stack: 'Stack 0',
    },
  ],
};

export function BarChart() {
  return <Bar options={options} data={data} />;
}
