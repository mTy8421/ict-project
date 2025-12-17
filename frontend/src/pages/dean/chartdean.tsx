import React, { useEffect, useState, useMemo } from "react";
import { Layout } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import DeanHeader from "../../components/dean/Header";
import DeanNavbar from "../../components/dean/Navbar";
import ReHeader from "../../components/dean/NavbarHeader";
import theme from "../../theme";
import axiosInstance from "../../utils/axios";

const { Content } = Layout;

// --- Types ---
interface SupervisorData {
  name: string;
  critical: number;
  normal: number;
  totalHours: number;
  efficiency: number;
}

interface TopicData {
  topic: string;
  hours: number;
  impact: string;
}

interface IconProps {
  size?: number;
  className?: string;
}

interface Workload {
  id: number;
  description: string;
  department: string;
  status: "pending" | "not_completed" | "completed";
  startTime: string; // Duration in HH:mm:ss format
  dateTimeNow: string; // Date of the record
  options: any;
}

// --- Icons (Inline SVGs) ---
const Clock: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const AlertTriangle: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const Users: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ArrowLeft: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const Activity: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const Filter: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

// --- Colors ---
const COLORS = {
  critical: "#EF4444",
  normal: "#3B82F6",
  success: "#10B981",
  warning: "#F59E0B",
};

// --- Components ---
interface KPICardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.FC<IconProps>;
  colorClass: string;
  trend: "positive" | "negative";
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  colorClass,
  trend,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p
        className={`text-xs mt-2 font-medium ${trend === "negative" ? "text-red-500" : "text-emerald-600"}`}
      >
        {subtext}
      </p>
    </div>
    <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
      <Icon size={24} className={colorClass.replace("bg-", "text-")} />
    </div>
  </div>
);

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
    <p className="text-sm text-slate-500">{subtitle}</p>
  </div>
);

// --- Main Component ---
export default function ChartDean() {
  const [viewState, setViewState] = useState<"overview" | "drilldown">(
    "overview",
  );
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const [workloads, setWorkloads] = useState<Workload[]>([]);

  const fetchWorkloads = async () => {
    try {
      const response = await axiosInstance.get("/work");
      setWorkloads(response.data);
    } catch (error) {
      console.error("Error fetching workloads:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkloads();
  }, []);

  // --- Data Processing (useMemo) ---
  const {
    supervisorData,
    topicData,
    totalHoursFormatted,
    criticalPct,
    avgTimeFormatted,
    bottleneck,
    departmentTasks, // Map of department -> tasks
  } = useMemo(() => {
    const completed = workloads.filter((w) => w.status === "completed");

    // Group by Department
    const deptGroups = new Map<
      string,
      { critical: number; normal: number; total: number; tasks: Workload[] }
    >();

    // Group by Topic
    const topicGroups = new Map<string, number>();

    let totalMinutes = 0;
    let criticalCount = 0;

    completed.forEach((w) => {
      // Parse duration HH:mm:ss
      const [h, m] = (w.startTime || "0:0").split(":").map(Number);
      const durationMins = (h || 0) * 60 + (m || 0);
      const durationHours = durationMins / 60;

      totalMinutes += durationMins;

      const isCritical = w.options?.priority === "high";
      if (isCritical) criticalCount++;

      // Topic
      const topic = w.options?.title || "ไม่ระบุหัวข้อ";
      topicGroups.set(topic, (topicGroups.get(topic) || 0) + durationHours);

      // Department
      const dept = w.department || "ไม่ระบุแผนก";
      if (!deptGroups.has(dept)) {
        deptGroups.set(dept, { critical: 0, normal: 0, total: 0, tasks: [] });
      }
      const g = deptGroups.get(dept)!;
      g.total += durationHours;
      if (isCritical) g.critical += durationHours;
      else g.normal += durationHours;
      g.tasks.push(w);
    });

    // Format for Supervisor Chart
    const supervisorData: SupervisorData[] = Array.from(
      deptGroups.entries(),
    ).map(([name, stats]) => ({
      name,
      critical: parseFloat(stats.critical.toFixed(2)),
      normal: parseFloat(stats.normal.toFixed(2)),
      totalHours: parseFloat(stats.total.toFixed(2)),
      efficiency:
        stats.total > 0 ? Math.round((stats.normal / stats.total) * 100) : 100,
    }));

    // Format for Topics
    const topicData: TopicData[] = Array.from(topicGroups.entries())
      .map(([topic, hours]) => ({
        topic,
        hours: parseFloat(hours.toFixed(1)),
        impact: hours > 20 ? "High" : hours > 5 ? "Medium" : "Low",
      }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);

    // KPIs
    const totalHours = Math.floor(totalMinutes / 60);
    const totalHoursFormatted = `${totalHours.toLocaleString()} ชม.`;

    const avgMinutes = completed.length
      ? Math.round(totalMinutes / completed.length)
      : 0;
    const avgTimeFormatted =
      avgMinutes > 60
        ? `${Math.floor(avgMinutes / 60)} ชม. ${avgMinutes % 60} น.`
        : `${avgMinutes} นาที`;

    const criticalPct = completed.length
      ? Math.round((criticalCount / completed.length) * 100)
      : 0;

    const bottleneck = topicData.length > 0 ? topicData[0] : null;

    // Create a simple map for drilldown lookup
    const departmentTasks = new Map<string, Workload[]>();
    deptGroups.forEach((val, key) => {
      departmentTasks.set(key, val.tasks);
    });

    return {
      supervisorData,
      topicData,
      totalHoursFormatted,
      criticalPct,
      avgTimeFormatted,
      bottleneck,
      departmentTasks,
    };
  }, [workloads]);

  const handleBarClick = (data: any) => {
    if (data && data.activePayload) {
      const teamName = data.activePayload[0].payload.name;
      setSelectedTeam(teamName);
      setViewState("drilldown");
    }
  };

  const handleBack = () => {
    setViewState("overview");
    setSelectedTeam(null);
  };

  const renderOverview = () => (
    <div className="space-y-6 animate-fade-in">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
      `}</style>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="ชั่วโมงซัพพอร์ตโดยรวม"
          value={totalHoursFormatted}
          subtext="รวมงานที่เสร็จสิ้นทั้งหมด"
          icon={Clock}
          colorClass="bg-blue-500 text-blue-600"
          trend="positive"
        />
        <KPICard
          title="% งานด่วน (Critical)"
          value={`${criticalPct}%`}
          subtext={criticalPct > 30 ? "สูงกว่าเกณฑ์มาตรฐาน" : "อยู่ในเกณฑ์ปกติ"}
          icon={AlertTriangle}
          colorClass={
            criticalPct > 30
              ? "bg-red-500 text-red-600"
              : "bg-green-500 text-green-600"
          }
          trend={criticalPct > 30 ? "negative" : "positive"}
        />
        <KPICard
          title="เวลาปิดงานเฉลี่ย"
          value={avgTimeFormatted}
          subtext="เวลาเฉลี่ยต่อหนึ่งงาน"
          icon={Activity}
          colorClass="bg-indigo-500 text-indigo-600"
          trend="positive"
        />
        <KPICard
          title="ปัญหาคอขวดสูงสุด"
          value={bottleneck ? bottleneck.topic : "-"}
          subtext={
            bottleneck ? `เสียเวลา ${bottleneck.hours} ชม.` : "ไม่มีข้อมูล"
          }
          icon={Filter}
          colorClass="bg-orange-500 text-orange-600"
          trend="negative"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Comparison Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <SectionHeader
              title="การกระจายภาระงานตามแผนก"
              subtitle="เปรียบเทียบงานด่วน vs งานทั่วไป (คลิกที่กราฟเพื่อดูรายละเอียด)"
            />
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-sm"></div> งานด่วน
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-sm"></div> งานทั่วไป
              </span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={supervisorData}
                onClick={handleBarClick}
                layout="horizontal"
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  label={{
                    value: "ชั่วโมง",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#94A3B8",
                  }}
                />
                <Tooltip
                  cursor={{ fill: "#F1F5F9" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="critical"
                  stackId="a"
                  fill={COLORS.critical}
                  radius={[0, 0, 4, 4]}
                  barSize={50}
                  name="งานด่วน (ชม.)"
                />
                <Bar
                  dataKey="normal"
                  stackId="a"
                  fill={COLORS.normal}
                  radius={[4, 4, 0, 0]}
                  barSize={50}
                  name="งานทั่วไป (ชม.)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs text-slate-400 text-center italic">
            * คลิกที่แท่งกราฟเพื่อดูรายการงานในแผนกนั้น
          </div>
        </div>

        {/* Problem Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <SectionHeader
            title="หัวข้อที่เสียเวลามากที่สุด"
            subtitle="จัดอันดับปัญหาที่กินเวลาทีมงาน"
          />
          <div className="space-y-4">
            {topicData.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">
                    {item.topic}
                  </span>
                  <span className="text-slate-500">{item.hours} ชม.</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full ${index === 0 ? "bg-red-500" : "bg-slate-400"}`}
                    style={{
                      width: `${(item.hours / (topicData[0]?.hours || 1)) * 100}%`,
                    }}
                  ></div>
                </div>
                {index === 0 && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertTriangle size={10} /> ควรตรวจสอบและแก้ไข (High Impact)
                  </p>
                )}
              </div>
            ))}
            {topicData.length === 0 && (
              <div className="text-center text-slate-400 text-sm py-8">
                ไม่มีข้อมูลงานที่เสร็จสิ้น
              </div>
            )}
          </div>
          {topicData.length > 0 && (
            <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <h4 className="text-indigo-900 font-semibold text-sm mb-2">
                ข้อเสนอแนะ (Recommendation)
              </h4>
              <p className="text-xs text-indigo-700 leading-relaxed">
                <strong>"{topicData[0]?.topic}"</strong> กินเวลามากที่สุด
                การปรับปรุงกระบวนการหรือแก้ไขที่ต้นเหตุอาจช่วยลดภาระงานลงได้
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDrillDown = () => {
    const tasks = selectedTeam ? departmentTasks.get(selectedTeam) || [] : [];

    return (
      <div className="animate-slide-in">
        <style>{`
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>
        <button
          onClick={handleBack}
          className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors font-medium cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft size={20} className="mr-2" /> กลับไปหน้าภาพรวม
        </button>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Users size={24} className="text-blue-500" />
                {selectedTeam} : รายละเอียดภาระงาน
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                รายการงานทั้งหมดในแผนก
              </p>
            </div>
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600">
                จำนวนงาน: <strong>{tasks.length}</strong>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b border-slate-100">
                    หัวข้อ (Topic)
                  </th>
                  <th className="p-4 font-semibold border-b border-slate-100">
                    รายละเอียด
                  </th>
                  <th className="p-4 font-semibold border-b border-slate-100 text-right">
                    วันที่
                  </th>
                  <th className="p-4 font-semibold border-b border-slate-100 text-right">
                    ระยะเวลา
                  </th>
                  <th className="p-4 font-semibold border-b border-slate-100 text-center">
                    ความเร่งด่วน
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4 font-medium text-slate-800">
                      {task.options?.title || "-"}
                    </td>
                    <td className="p-4 text-slate-600 truncate max-w-xs">
                      {task.description}
                    </td>
                    <td className="p-4 text-slate-800 text-right">
                      {task.dateTimeNow
                        ? new Date(task.dateTimeNow).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-4 text-slate-800 text-right font-bold">
                      {task.startTime}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.options?.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : task.options?.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.options?.priority || "Normal"}
                      </span>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      ไม่พบข้อมูลงานในแผนกนี้
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh", background: theme.background }}>
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
        <Layout style={{ padding: theme.spacing.xl, overflow: "auto" }}>
          <Content
            style={{ maxWidth: "80dvw", margin: "0 auto", width: "100%" }}
          >
            {/* Embedded Dashboard Content */}
            <div className="bg-transparent font-sans text-slate-900 w-full">
              <div className="w-full">
                <header className="mb-8">
                  <h1 className="text-2xl font-bold text-slate-900">
                    ศูนย์ปฏิบัติการฝ่ายสนับสนุน (Support Ops Center)
                  </h1>
                  <p className="text-slate-500">
                    แดชบอร์ดผู้บริหารและการวางแผนทรัพยากรบุคคล
                  </p>
                </header>
                {viewState === "overview"
                  ? renderOverview()
                  : renderDrillDown()}
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
