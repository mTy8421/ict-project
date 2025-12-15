import React, { useState } from "react";
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

interface Employee {
  id: number;
  name: string;
  role: string;
  totalHours: number;
  criticalTask: number;
  avgTime: string;
  status: string;
}

interface IconProps {
  size?: number;
  className?: string;
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

// --- Mock Data ---
const supervisorData: SupervisorData[] = [
  {
    name: "ทีม A (คุณสมศักดิ์)",
    critical: 120,
    normal: 340,
    totalHours: 460,
    efficiency: 85,
  },
  {
    name: "ทีม B (คุณวิชัย)",
    critical: 280,
    normal: 150,
    totalHours: 430,
    efficiency: 72,
  },
  {
    name: "ทีม C (คุณมาลี)",
    critical: 40,
    normal: 200,
    totalHours: 240,
    efficiency: 95,
  },
  {
    name: "ทีม D (คุณปราณี)",
    critical: 90,
    normal: 310,
    totalHours: 400,
    efficiency: 88,
  },
];

const topicData: TopicData[] = [
  { topic: "ปัญหาเข้าสู่ระบบ/Auth", hours: 450, impact: "High" },
  { topic: "ขอดึงข้อมูลรายงาน", hours: 320, impact: "Medium" },
  { topic: "ติดตั้งซอฟต์แวร์", hours: 150, impact: "Low" },
  { topic: "อุปกรณ์ฮาร์ดแวร์เสีย", hours: 120, impact: "Low" },
  { topic: "การเชื่อมต่อเครือข่าย", hours: 80, impact: "Medium" },
];

const teamB_Employees: Employee[] = [
  {
    id: 1,
    name: "พนักงาน 001",
    role: "Support L2",
    totalHours: 160,
    criticalTask: 120,
    avgTime: "2.5 ชม.",
    status: "งานล้นมือ (Overloaded)",
  },
  {
    id: 2,
    name: "พนักงาน 002",
    role: "Support L1",
    totalHours: 145,
    criticalTask: 90,
    avgTime: "1.2 ชม.",
    status: "งานหนัก (High Load)",
  },
  {
    id: 3,
    name: "พนักงาน 003",
    role: "Support L2",
    totalHours: 125,
    criticalTask: 70,
    avgTime: "2.0 ชม.",
    status: "ปกติ (Normal)",
  },
];

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
          value="1,530 ชม."
          subtext="+12% จากเดือนที่แล้ว"
          icon={Clock}
          colorClass="bg-blue-500 text-blue-600"
          trend="negative"
        />
        <KPICard
          title="% งานด่วน (Critical)"
          value="35%"
          subtext="เกินเกณฑ์มาตรฐาน (30%)"
          icon={AlertTriangle}
          colorClass="bg-red-500 text-red-600"
          trend="negative"
        />
        <KPICard
          title="เวลาปิดงานเฉลี่ย"
          value="45 นาที"
          subtext="-5 นาที (ดีขึ้น)"
          icon={Activity}
          colorClass="bg-indigo-500 text-indigo-600"
          trend="positive"
        />
        <KPICard
          title="ปัญหาคอขวดสูงสุด"
          value="ระบบ Login"
          subtext="เสียเวลา 450 ชม./เดือน"
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
              title="การกระจายภาระงานตามหัวหน้าทีม"
              subtitle="เปรียบเทียบงานด่วน vs งานทั่วไป (คลิกที่กราฟเพื่อดูรายชื่อพนักงาน)"
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
            * คลิกที่แท่งกราฟเพื่อดูรายละเอียดพนักงานในทีมนั้น
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
                    style={{ width: `${(item.hours / 500) * 100}%` }}
                  ></div>
                </div>
                {index === 0 && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertTriangle size={10} /> ควรเร่งแก้ไขที่ระบบ (System Fix)
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <h4 className="text-indigo-900 font-semibold text-sm mb-2">
              ข้อเสนอแนะ (Recommendation)
            </h4>
            <p className="text-xs text-indigo-700 leading-relaxed">
              <strong>"ปัญหาเข้าสู่ระบบ/Auth"</strong> กินเวลาถึง 30% ของทั้งหมด
              การแก้ไขระบบ SSO อาจช่วยประหยัดเวลาได้ประมาณ 450 ชม./เดือน
              (เทียบเท่ากำลังคน 2.8 คน)
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDrillDown = () => (
    <div className="animate-slide-in">
      <style>{`
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>
      <button
        onClick={handleBack}
        className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors font-medium"
      >
        <ArrowLeft size={20} className="mr-2" /> กลับไปหน้าภาพรวม
      </button>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Users size={24} className="text-blue-500" />
              {selectedTeam} : รายละเอียดประสิทธิภาพทีม
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              มุมมองเจาะลึกแสดงภาระงานรายบุคคล
            </p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600">
              หัวหน้าทีม: <strong>คุณวิชัย</strong>
            </div>
            <div className="px-4 py-2 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 font-medium">
              ระดับความเสี่ยง: สูง (High)
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold border-b border-slate-100">
                  ชื่อพนักงาน
                </th>
                <th className="p-4 font-semibold border-b border-slate-100">
                  ตำแหน่ง
                </th>
                <th className="p-4 font-semibold border-b border-slate-100 text-right">
                  ชั่วโมงรวม
                </th>
                <th className="p-4 font-semibold border-b border-slate-100 text-right">
                  งานด่วน (ชม.)
                </th>
                <th className="p-4 font-semibold border-b border-slate-100 text-center">
                  สถานะภาระงาน
                </th>
                <th className="p-4 font-semibold border-b border-slate-100 text-center">
                  ดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamB_Employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-4 font-medium text-slate-800">{emp.name}</td>
                  <td className="p-4 text-slate-600">{emp.role}</td>
                  <td className="p-4 text-slate-800 text-right font-bold">
                    {emp.totalHours}
                  </td>
                  <td className="p-4 text-red-600 text-right font-medium">
                    {emp.criticalTask}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.status.includes("Overloaded") ? "bg-red-100 text-red-800" : emp.status.includes("High Load") ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      ดูงานคงค้าง
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-yellow-50 text-yellow-800 text-sm flex items-center gap-2 m-4 rounded-lg border border-yellow-100">
          <AlertTriangle size={16} />
          <strong>Insight:</strong> พนักงาน 001 รับภาระงานด่วนถึง 40% ของทีม
          แนะนำให้กระจายงานทั่วไป (Non-critical) ไปให้ พนักงาน 003 แทน
          เพื่อลดความเสี่ยง
        </div>
      </div>
    </div>
  );

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
