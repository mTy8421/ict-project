import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Layout, message } from "antd";
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
  Filler,
);

const { Content } = Layout;

// interface Workload {
//   id: number;
//   description: string;
//   department: string;
//   status: "pending" | "not_completed" | "completed";
//   startTime: string; // Duration in HH:mm:ss format
//   dateTimeNow: string; // Date of the record
//   options: any;
// }

interface Workload {
  user_id: number;
  user_name: string;
  user_role: string;
  works: any;
}

const HeadChart: React.FC = () => {
  const navigate = useNavigate();
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [teamName, setTeamName] = useState("");

  const fetchWorkloads = async () => {
    try {
      const userProfile = await axiosInstance.get("/user/profile");
      const userData = userProfile.data;
      const textUser = userData.user_role.split("หัวหน้า");
      setTeamName(textUser[1]);
      if (userData.user_role !== "หัวหน้าสำนักงาน") {
        const response = await axiosInstance.get(
          `/user/roles/พนัก${textUser[1]}`,
        );
        setWorkloads(response.data);
      } else {
        const response = await axiosInstance.get(`/user/userAll`);
        setWorkloads(response.data);
      }
    } catch (error) {
      console.error("Error fetching workloads:", error);
      message.error("ไม่สามารถดึงข้อมูลภาระงานได้");
    }
  };

  useEffect(() => {
    fetchWorkloads();
  }, []);

  console.table(workloads);

  // --- Data Processing ---
  const {
    efficiencyData,
    workloadLabels,
    workloadValues,
    teamAvgWorkload,
    topics,
    topicTime,
    kpiStats,
  } = React.useMemo(() => {
    // 1. Agent Efficiency & Workload
    const agentStats = new Map<string, { count: number; totalHours: number }>();
    // 2. Topic Insights
    const topicStats = new Map<string, number>();
    // 3. KPIs (Avg Time by Urgency)
    const urgencyStats = {
      high: { totalHours: 0, count: 0 },
      medium: { totalHours: 0, count: 0 },
      low: { totalHours: 0, count: 0 },
    };

    let totalCompletedCount = 0;

    const parseDurationToHours = (timeStr: string) => {
      if (!timeStr) return 0;
      const parts = timeStr.split(":").map(Number);
      let hours = 0;
      if (parts.length >= 2) {
        hours = (parts[0] || 0) + (parts[1] || 0) / 60;
        if (parts.length === 3) hours += (parts[2] || 0) / 3600;
      } else if (parts.length === 1) {
        hours = parts[0] || 0;
      }
      return hours;
    };

    workloads.forEach((user) => {
      // Assuming 'works' is the array of tasks on the user object
      const userWorks = user.works || [];
      const completed = userWorks.filter((w: any) => w.status === "completed");

      completed.forEach((w: any) => {
        totalCompletedCount++;
        const hours = parseDurationToHours(w.startTime);

        // Agent Stats (Using user_name from the User object)
        const agentName = user.user_name || "Unknown Agent";
        const currentAgent = agentStats.get(agentName) || {
          count: 0,
          totalHours: 0,
        };
        currentAgent.count += 1;
        currentAgent.totalHours += hours;
        agentStats.set(agentName, currentAgent);

        // Topic Stats
        const topic = w.options?.title || "Unspecified";
        topicStats.set(topic, (topicStats.get(topic) || 0) + hours);

        // Urgency Stats
        const priority = (w.options?.priority || "low").toLowerCase();
        if (priority === "high") {
          urgencyStats.high.totalHours += hours;
          urgencyStats.high.count++;
        } else if (priority === "medium") {
          urgencyStats.medium.totalHours += hours;
          urgencyStats.medium.count++;
        } else {
          urgencyStats.low.totalHours += hours;
          urgencyStats.low.count++;
        }
      });
    });

    // Transform for Charts

    // Efficiency & Workload
    const efficiency = Array.from(agentStats.entries()).map(([name, stat]) => ({
      name,
      x:
        stat.count > 0
          ? parseFloat((stat.totalHours / stat.count).toFixed(2))
          : 0, // Avg Time (Hours)
      y: stat.count, // Volume
    }));

    const sortedByVolume = [...efficiency].sort((a, b) => b.y - a.y);
    const wLabels = sortedByVolume.map((d) => d.name);
    const wValues = sortedByVolume.map((d) => d.y);
    const avgWorkload =
      wValues.length > 0
        ? wValues.reduce((a, b) => a + b, 0) / wValues.length
        : 0;

    // Topics
    const sortedTopics = Array.from(topicStats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Top 10 by hours
    const tLabels = sortedTopics.map((d) => d[0]);
    const tValues = sortedTopics.map((d) => parseFloat(d[1].toFixed(1)));

    // KPI Stats
    const getAvg = (s: { totalHours: number; count: number }) =>
      s.count > 0 ? (s.totalHours / s.count).toFixed(1) : "0.0";

    return {
      efficiencyData: efficiency,
      workloadLabels: wLabels,
      workloadValues: wValues,
      teamAvgWorkload: avgWorkload,
      topics: tLabels,
      topicTime: tValues,
      kpiStats: {
        high: getAvg(urgencyStats.high),
        medium: getAvg(urgencyStats.medium),
        low: getAvg(urgencyStats.low),
        total: totalCompletedCount.toLocaleString(),
      },
    };
  }, [workloads]);

  // --- Chart Configurations ---

  // 1. Workload Chart Config
  const workloadChartData = {
    labels: workloadLabels,
    datasets: [
      {
        label: "งานที่ถูกอนุมัติ",
        data: workloadValues,
        backgroundColor: workloadValues.map((v) =>
          v > teamAvgWorkload * 1.2
            ? "#EF4444"
            : v < teamAvgWorkload * 0.8
              ? "#FBBF24"
              : "#3B82F6",
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
              " งาน, เฉลี่ย " +
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
          text: "เวลาเฉลี่ยต่องาน (ชั่วโมง) -> ยิ่งขวา ยิ่งใช้เวลานาน",
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: "จำนวนงานที่สำเร็จ -> ยิ่งสูง ยิ่งปริมาณงานเยอะ",
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
                    Support Team Performance
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    รายงานสรุปประสิทธิภาพการดำเนินงาน (Completed Tasks) | ทีม
                    {teamName}
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
                        {kpiStats.high}{" "}
                        <span className="text-sm font-normal text-gray-500">
                          ชม./เคส
                        </span>
                      </h2>
                    </div>
                    <div className="p-2 bg-red-50 rounded-lg text-red-600">
                      <FireOutlined style={{ fontSize: "1.25rem" }} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3 flex items-center font-medium">
                    <MinusOutlined className="mr-1" /> ข้อมูลปัจจุบัน
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
                        {kpiStats.medium}{" "}
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
                  <p className="text-xs text-gray-400 mt-3 flex items-center font-medium">
                    <MinusOutlined className="mr-1" /> ข้อมูลปัจจุบัน
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
                        {kpiStats.low}{" "}
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
                    <MinusOutlined className="mr-1" /> ข้อมูลปัจจุบัน
                  </p>
                </div>

                {/* Total Completed */}
                <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500 hover:-translate-y-1 transition-transform duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        งานที่สำเร็จทั้งหมด
                      </p>
                      <h2 className="text-3xl font-bold text-gray-800 mt-1">
                        {kpiStats.total}{" "}
                        <span className="text-sm font-normal text-gray-500">
                          งาน
                        </span>
                      </h2>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <FileDoneOutlined style={{ fontSize: "1.25rem" }} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3 flex items-center font-medium">
                    <MinusOutlined className="mr-1" /> ข้อมูลปัจจุบัน
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
                      หน่วย: จำนวนงานที่ปิดได้
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    เปรียบเทียบปริมาณงานรายบุคคล เทียบกับค่าเฉลี่ยของทีม
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
