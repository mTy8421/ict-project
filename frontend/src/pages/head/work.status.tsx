import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { Layout } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
  FireOutlined,
} from "@ant-design/icons";
import moment from "moment";
import axiosInstance from "../../utils/axios";
import theme from "../../theme";
import DeanHeader from "../../components/head/Header";
import DeanNavbar from "../../components/head/Navbar";
import ReHeader from "../../components/head/NavbarHeader";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

interface Workload {
  id: number;
  description: string;
  department: string;
  status: "pending" | "not_completed" | "completed";
  startTime: string; // Duration in HH:mm:ss format
  dateTimeNow: string; // Date of the record
  options: any;
}

const HeadWorkStatus: React.FC = () => {
  const { id } = useParams();
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [dateFilter, setDateFilter] = useState<
    "thisMonth" | "lastMonth" | "thisYear"
  >("thisMonth");

  const fetchWorkloads = async () => {
    try {
      const response = await axiosInstance.get(`/work/head/${id}`);
      setWorkloads(response.data);
    } catch (error) {
      console.error("Error fetching workloads:", error);
    }
  };

  useEffect(() => {
    fetchWorkloads();
  }, []);

  // --- Data Processing & Metrics ---
  const metrics = useMemo(() => {
    // Filter by Date Range
    const filteredByDate = workloads.filter((w) => {
      if (!w.dateTimeNow) return false;
      const date = moment(w.dateTimeNow);
      const now = moment();

      if (dateFilter === "thisMonth") {
        return date.isSame(now, "month");
      }
      if (dateFilter === "lastMonth") {
        return date.isSame(now.clone().subtract(1, "months"), "month");
      }
      if (dateFilter === "thisYear") {
        return date.isSame(now, "year");
      }
      return true;
    });

    // Filter for completed tasks as per design "Completed Tasks" label
    const completedTasks = filteredByDate.filter(
      (w) => w.status === "completed",
    );

    let totalMinutes = 0;
    const urgencyCounts = { high: 0, medium: 0, low: 0 };
    const topicTimeMap: { [key: string]: number } = {};

    completedTasks.forEach((task) => {
      // Calculate Duration from startTime (HH:mm:ss)
      let minutes = 0;
      if (task.startTime) {
        const [hrs, mins] = task.startTime.split(":").map(Number);
        minutes = (hrs || 0) * 60 + (mins || 0);
      }

      totalMinutes += minutes;

      // Count Urgency
      const priority = task.options?.priority || "low"; // Default to low if missing
      if (priority === "high") urgencyCounts.high++;
      else if (priority === "medium") urgencyCounts.medium++;
      else urgencyCounts.low++;

      // Topic Time (Group by description)
      const topic = task.options?.title || "Unspecified";
      topicTimeMap[topic] = (topicTimeMap[topic] || 0) + minutes;
    });

    const totalTasks = completedTasks.length;
    const avgMinutes =
      totalTasks > 0 ? Math.round(totalMinutes / totalTasks) : 0;
    const highUrgencyPct =
      totalTasks > 0 ? Math.round((urgencyCounts.high / totalTasks) * 100) : 0;

    // Sort topics by time descending
    const sortedTopics = Object.keys(topicTimeMap).sort(
      (a, b) => topicTimeMap[b] - topicTimeMap[a],
    );

    return {
      completedTasks,
      totalTasks,
      totalMinutes,
      avgMinutes,
      highUrgencyPct,
      urgencyCounts,
      topicTimeMap,
      sortedTopics,
    };
  }, [workloads, dateFilter]);

  // --- Helper Functions ---
  const formatTime = (totalMin: number) => {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    if (h > 0) return `${h} ชม. ${m} น.`;
    return `${m} นาที`;
  };

  const getUrgencyBadge = (priority: string) => {
    const p = priority?.toLowerCase();
    if (p === "high")
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          สูง
        </span>
      );
    if (p === "medium")
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
          ปานกลาง
        </span>
      );
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        ต่ำ
      </span>
    );
  };

  // --- Chart Configurations ---
  const urgencyChartData = {
    labels: ["สูง", "ปานกลาง", "ต่ำ"],
    datasets: [
      {
        data: [
          metrics.urgencyCounts.high,
          metrics.urgencyCounts.medium,
          metrics.urgencyCounts.low,
        ],
        backgroundColor: ["#EF4444", "#F59E0B", "#10B981"], // Red, Amber, Emerald
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const urgencyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" as const },
    },
    cutout: "65%",
  };

  const topicChartData = {
    labels: metrics.sortedTopics,
    datasets: [
      {
        label: "เวลาที่ใช้ (นาที)",
        data: metrics.sortedTopics.map((t) => metrics.topicTimeMap[t]),
        backgroundColor: "#3B82F6", // Blue
        borderRadius: 4,
      },
    ],
  };

  const topicChartOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: "#f3f4f6" },
      },
      y: {
        grid: { display: false },
      },
    },
  };

  return (
    <Layout style={{ minHeight: "100vh", background: theme.background }}>
      {/* --- Header & Navbar Shell (Existing) --- */}
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

        {/* --- Main Content Area (Updated Design) --- */}
        <Layout style={{ overflow: "auto", background: "#f3f4f6" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Filter & Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 m-0">
                  ผลการปฏิบัติงานรายบุคคล
                </h1>
                <p className="text-sm text-gray-500 m-0">
                  ข้อมูลงานที่เสร็จสิ้น (Completed Tasks)
                </p>
              </div>
              <div className="flex bg-white rounded-lg shadow-sm p-1 border border-gray-200">
                <button
                  onClick={() => setDateFilter("thisMonth")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md border-none cursor-pointer transition-colors ${dateFilter === "thisMonth"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 bg-transparent"
                    }`}
                >
                  เดือนนี้
                </button>
                <button
                  onClick={() => setDateFilter("lastMonth")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md border-none cursor-pointer transition-colors ${dateFilter === "lastMonth"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 bg-transparent"
                    }`}
                >
                  เดือนที่แล้ว
                </button>
                <button
                  onClick={() => setDateFilter("thisYear")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md border-none cursor-pointer transition-colors ${dateFilter === "thisYear"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 bg-transparent"
                    }`}
                >
                  ปีนี้
                </button>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Card 1: Total Tasks */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:translate-y-[-2px] hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500 m-0">
                    งานที่เสร็จทั้งหมด
                  </h3>
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600 flex items-center justify-center">
                    <CheckCircleOutlined style={{ fontSize: "16px" }} />
                  </div>
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    {metrics.totalTasks}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">งาน</span>
                </div>
              </div>

              {/* Card 2: Total Time */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:translate-y-[-2px] hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500 m-0">
                    เวลารวมที่ใช้
                  </h3>
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600 flex items-center justify-center">
                    <ClockCircleOutlined style={{ fontSize: "16px" }} />
                  </div>
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatTime(metrics.totalMinutes)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 m-0">
                  คำนวณจาก ชม. + นาที
                </p>
              </div>

              {/* Card 3: Avg Time */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:translate-y-[-2px] hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500 m-0">
                    เวลาเฉลี่ย/งาน
                  </h3>
                  <div className="p-2 bg-green-50 rounded-lg text-green-600 flex items-center justify-center">
                    <FieldTimeOutlined style={{ fontSize: "16px" }} />
                  </div>
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatTime(metrics.avgMinutes)}
                  </span>
                </div>
              </div>

              {/* Card 4: High Urgency % */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:translate-y-[-2px] hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500 m-0">
                    สัดส่วนงานด่วนสูง
                  </h3>
                  <div className="p-2 bg-red-50 rounded-lg text-red-600 flex items-center justify-center">
                    <FireOutlined style={{ fontSize: "16px" }} />
                  </div>
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    {metrics.highUrgencyPct}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-red-500 h-1.5 rounded-full"
                    style={{ width: `${metrics.highUrgencyPct}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Pie Chart: Urgency */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 mt-0">
                  ความเร่งด่วนของงาน (Urgency)
                </h3>
                <div className="relative h-64">
                  <Doughnut
                    data={urgencyChartData}
                    options={urgencyChartOptions}
                  />
                </div>
                <div className="mt-4 text-center text-sm text-gray-500">
                  แสดงสัดส่วนจำนวนงานตามความเร่งด่วน
                </div>
              </div>

              {/* Bar Chart: Topic Analysis */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-800 mb-4 mt-0">
                  เวลาที่ใช้แยกตามหัวข้อ (นาที)
                </h3>
                <div className="relative h-64">
                  <Bar data={topicChartData} options={topicChartOptions} />
                </div>
                <div className="mt-4 text-right text-sm text-gray-500">
                  * กราฟแสดงผลรวมเวลา (นาที) ที่ใช้ในแต่ละหัวข้อ
                </div>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800 m-0">
                  รายการงานล่าสุด (Log)
                </h3>
                <button className="text-sm text-blue-600 font-medium hover:underline bg-transparent border-none cursor-pointer">
                  ดูทั้งหมด
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="text-sm text-gray-500 border-b border-gray-100">
                      <th className="px-6 py-3 font-medium bg-white">
                        หัวข้อ (Topic)
                      </th>
                      <th className="px-6 py-3 font-medium bg-white">
                        รายระเอียด
                      </th>
                      <th className="px-6 py-3 font-medium bg-white">
                        ระดับความเร่งด่วน
                      </th>
                      <th className="px-6 py-3 font-medium text-right bg-white">
                        เวลาที่ใช้ (ชม : นาที)
                      </th>
                      <th className="px-6 py-3 font-medium text-right bg-white">
                        รวมนาที
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {metrics.completedTasks.map((task) => {
                      let totalMins = 0;
                      let hrs = 0;
                      let mins = 0;

                      if (task.startTime) {
                        const parts = task.startTime.split(":").map(Number);
                        hrs = parts[0] || 0;
                        mins = parts[1] || 0;
                        totalMins = hrs * 60 + mins;
                      }

                      return (
                        <tr
                          key={task.id}
                          className="hover:bg-gray-50 border-b border-gray-50 last:border-0"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 truncate">
                            {task.options?.title || "-"}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900 truncate">
                            {task.description || "-"}
                          </td>
                          <td className="px-6 py-4">
                            {getUrgencyBadge(task.options?.priority)}
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-gray-600">
                            {hrs} ชม. {mins.toString().padStart(2, "0")} น.
                          </td>
                          <td className="px-6 py-4 text-right text-gray-400 text-xs">
                            ({totalMins} น.)
                          </td>
                        </tr>
                      );
                    })}
                    {metrics.completedTasks.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          ไม่มีข้อมูลงานที่เสร็จสิ้น
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default HeadWorkStatus;
