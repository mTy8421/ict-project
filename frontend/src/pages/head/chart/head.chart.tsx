import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Layout } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Scatter } from "react-chartjs-2";
import {
  LineChartOutlined,
  FireOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  FileDoneOutlined,
  ContainerOutlined,
  AimOutlined,
  BulbOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  MinusOutlined,
} from "@ant-design/icons";

import axiosInstance from "../../../utils/axios";
import theme from "../../../theme";
import DeanHeader from "../../../components/head/Header";
import DeanNavbar from "../../../components/head/Navbar";
import ReHeader from "../../../components/head/NavbarHeader";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const { Content } = Layout;

interface Workload {
  id: number;
  description: string;
  department: string;
  status: "pending" | "not_completed" | "completed";
  startTime: string;
  options: any;
}

const HeadChart: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [workloads, setWorkloads] = useState<Workload[]>([]);

  const fetchWorkloads = async () => {
    try {
      const response = await axiosInstance.get("/work/user");
      setWorkloads(response.data);
    } catch (error) {
      console.error("Error fetching workloads:", error);
    }
  };

  useEffect(() => {
    fetchWorkloads();
  }, []);

  // --- Mock Data Generation (matching design.html) ---
  const agents = Array.from({ length: 20 }, (_, i) => `Agent ${i + 1}`);

  // Random data for efficiency (Time vs Volume)
  // Use stable random for hydration consistency in React (optional, but good for demo)
  // For this implementation, simple generation is fine as it renders client-side.
  const efficiencyData = agents.map((agent) => {
    return {
      x: Math.floor(Math.random() * 8) + 1, // Avg Time (1-8 hours)
      y: Math.floor(Math.random() * 50) + 10, // Total Tickets (10-60)
      name: agent,
    };
  });

  // Sorted workload data (for bar chart)
  const workloadData = [...efficiencyData].sort((a, b) => b.y - a.y); // Sort by volume descending
  const workloadLabels = workloadData.map((d) => d.name);
  const workloadValues = workloadData.map((d) => d.y);
  const teamAvgWorkload = workloadValues.reduce((a, b) => a + b, 0) / 20;

  // Topics Data
  const topics = [
    "Login Issues",
    "Payment Error",
    "Bug Report",
    "Feature Request",
    "Account Recovery",
    "API Integration",
    "Data Import",
  ];
  const topicTime = [120, 95, 80, 60, 45, 150, 30]; // Total hours

  // --- Chart Configurations ---

  // 1. Workload Chart Config
  const workloadChartData = {
    labels: workloadLabels,
    datasets: [
      {
        label: "เคสที่สำเร็จ",
        data: workloadValues,
        backgroundColor: workloadValues.map((v) =>
          v > teamAvgWorkload * 1.2
            ? "#EF4444"
            : v < teamAvgWorkload * 0.8
            ? "#FBBF24"
            : "#3B82F6"
        ),
        borderRadius: 4,
      },
    ],
  };

  const workloadChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "x",
    plugins: {
      legend: { display: false },
      annotation: {
        // React-chartjs-2 doesn't include annotation plugin by default without installing chartjs-plugin-annotation.
        // We will omit the annotation line for now to avoid breaking if the plugin isn't installed.
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return context.raw + " เคส";
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90,
          font: { size: 10 },
        },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "จำนวนเคส (Volume)" },
      },
    },
  };

  // 2. Efficiency Matrix Config
  const efficiencyChartData = {
    datasets: [
      {
        label: "ประสิทธิภาพรายบุคคล",
        data: efficiencyData,
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const efficiencyChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return (
              context.raw.name +
              ": " +
              context.raw.y +
              " เคส, เฉลี่ย " +
              context.raw.x +
              " ชม."
            );
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "เวลาเฉลี่ยต่อเคส (ชั่วโมง) -> ยิ่งขวา ยิ่งใช้เวลานาน",
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: "จำนวนเคสที่สำเร็จ -> ยิ่งสูง ยิ่งปริมาณงานเยอะ",
        },
        beginAtZero: true,
      },
    },
  };

  // 3. Topic Insights Config
  const topicChartData = {
    labels: topics,
    datasets: [
      {
        label: "เวลารวมที่ใช้ (ชั่วโมง)",
        data: topicTime,
        backgroundColor: "#10B981",
        borderRadius: 4,
      },
    ],
  };

  const topicChartOptions: any = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { beginAtZero: true },
    },
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <div
        style={{
          display: window.innerWidth >= 768 ? "block" : "none",
        }}
      >
        <DeanHeader />
      </div>

      <div style={{ display: window.innerWidth < 768 ? "block" : "none" }}>
        <ReHeader />
      </div>

      <Layout style={{ height: "calc(100vh - 70px)" }}>
        <div
          style={{
            display: window.innerWidth >= 768 ? "block" : "none",
          }}
        >
          <DeanNavbar />
        </div>
        <Layout style={{ padding: 0, overflow: "auto" }}>
          <Content>
            <div className="p-4 md:p-8 font-sans">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <LineChartOutlined className="text-blue-600 mr-2" />
                    Support Team Performance Dashboard
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    รายงานสรุปประสิทธิภาพการดำเนินงาน (Completed Tasks) | ทีม
                    Technical Support (20 ท่าน)
                  </p>
                </div>
              </div>

              {/* Section 1: Team KPI */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {/* High Urgency */}
                <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-500 hover:-translate-y-1 transition-transform duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        เวลาเฉลี่ย (ความเร่งด่วนสูง)
                      </p>
                      <h2 className="text-3xl font-bold text-gray-800 mt-1">
                        1.5{" "}
                        <span className="text-sm font-normal text-gray-500">
                          ชม./เคส
                        </span>
                      </h2>
                    </div>
                    <div className="p-2 bg-red-50 rounded-lg text-red-600">
                      <FireOutlined style={{ fontSize: "1.25rem" }} />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-3 flex items-center font-medium">
                    <ArrowDownOutlined className="mr-1" /> เวลาลดลง 10% (ดีขึ้น)
                  </p>
                </div>

                {/* Medium Urgency */}
                <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-500 hover:-translate-y-1 transition-transform duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        เวลาเฉลี่ย (ความเร่งด่วนปานกลาง)
                      </p>
                      <h2 className="text-3xl font-bold text-gray-800 mt-1">
                        4.2{" "}
                        <span className="text-sm font-normal text-gray-500">
                          ชม./เคส
                        </span>
                      </h2>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                      <ExclamationCircleOutlined
                        style={{ fontSize: "1.25rem" }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-red-500 mt-3 flex items-center font-medium">
                    <ArrowUpOutlined className="mr-1" /> เวลาเพิ่มขึ้น 5%
                    (ช้าลง)
                  </p>
                </div>

                {/* Low Urgency */}
                <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500 hover:-translate-y-1 transition-transform duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        เวลาเฉลี่ย (ความเร่งด่วนต่ำ)
                      </p>
                      <h2 className="text-3xl font-bold text-gray-800 mt-1">
                        12.8
                        <span className="text-sm font-normal text-gray-500">
                          ชม./เคส
                        </span>
                      </h2>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                      <CheckCircleOutlined style={{ fontSize: "1.25rem" }} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3 flex items-center">
                    <MinusOutlined className="mr-1" /> ไม่เปลี่ยนแปลง
                  </p>
                </div>

                {/* Total Completed */}
                <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500 hover:-translate-y-1 transition-transform duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        เคสที่สำเร็จทั้งหมด
                      </p>
                      <h2 className="text-3xl font-bold text-gray-800 mt-1">
                        1,240{" "}
                        <span className="text-sm font-normal text-gray-500">
                          เคส
                        </span>
                      </h2>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <FileDoneOutlined style={{ fontSize: "1.25rem" }} />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-3 flex items-center font-medium">
                    <ArrowUpOutlined className="mr-1" /> +120 เคส (MoM)
                  </p>
                </div>
              </div>

              {/* Section 2: Agent Performance (Workload & Efficiency) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Workload Balance (Sorted Bar Chart) */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-700 flex items-center">
                      <ContainerOutlined className="text-indigo-500 mr-2" />
                      สมดุลภาระงานรายบุคคล (Workload Balance)
                    </h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border">
                      หน่วย: จำนวนเคสที่ปิดได้
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    เปรียบเทียบปริมาณงานรายบุคคล เทียบกับค่าเฉลี่ยของทีม
                    (เส้นประ)
                  </p>
                  <div className="relative h-[300px] w-full">
                    <Bar
                      data={workloadChartData}
                      options={workloadChartOptions}
                    />
                  </div>
                </div>

                {/* Efficiency Matrix (Scatter Plot) */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-700 flex items-center">
                      <AimOutlined className="text-purple-500 mr-2" />
                      เมทริกซ์ประสิทธิภาพ (Efficiency Matrix)
                    </h3>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium bg-transparent border-none cursor-pointer">
                      คำอธิบายแกนกราฟ
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    แกน X: เวลาเฉลี่ย (ซ้าย=เร็ว) | แกน Y: ปริมาณงาน (บน=มาก)
                  </p>
                  <div className="relative h-[300px] w-full">
                    <Scatter
                      data={efficiencyChartData}
                      options={efficiencyChartOptions}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Topic Insights (Horizontal Bar) */}
              <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-700 flex items-center">
                    <BulbOutlined className="text-yellow-500 mr-2" />
                    บทวิเคราะห์หัวข้องาน (Topic Insights)
                  </h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border">
                    เรียงตามเวลารวมที่ใช้ (ชั่วโมง)
                  </span>
                </div>
                <div className="relative h-[250px] w-full">
                  <Bar data={topicChartData} options={topicChartOptions} />
                </div>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default HeadChart;