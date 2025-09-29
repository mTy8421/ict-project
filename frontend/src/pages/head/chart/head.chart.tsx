import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Layout,
  Row,
  Col,
  Statistic,
  Progress,
  List,
  Tag,
  Select,
  DatePicker,
} from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../../utils/axios";
import theme from "../../../theme";
import DeanHeader from "../../../components/head/Header";
import DeanNavbar from "../../../components/head/Navbar";
import ReHeader from "../../../components/head/NavbarHeader";

import { BarChart } from "../../../lib/user/barChart";
import { Doughnuts } from "../../../lib/user/doughnutChart";

const { Content } = Layout;
const { Title, Text } = Typography;

interface Workload {
  id: number;
  description: string;
  department: string;
  status: "pending" | "not_completed" | "completed";
  dateTimeStart: string;
  dateTimeEnd: string;
  options: any;
}

const HeadChart: React.FC = () => {
  const navigate = useNavigate();
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState();

  const fetchWorkloads = async () => {
    try {
      const response = await axiosInstance.get("/work/user");
      setWorkloads(response.data);
    } catch (error) {
      console.error("Error fetching workloads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkloads();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "not_completed":
        return "processing";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "รอดำเนินการ";
      case "not_completed":
        return "ไม่อนุมัติ";
      case "completed":
        return "อนุมัติ";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "สูง";
      case "medium":
        return "ปานกลาง";
      case "low":
        return "ต่ำ";
      default:
        return priority;
    }
  };

  // const totalWorkloads = workloads.length;
  const totalWorkloads = workloads.filter((workloads) => {
    const recentWorkloads =
      !dateRange ||
      (workloads.dateTimeEnd?.toString() || "").includes(dateRange).toString();

    return recentWorkloads;
  });

  const completedWorkloads = workloads.filter(
    (w) => w.status === "completed"
  ).length;
  const inProgressWorkloads = workloads.filter(
    (w) => w.status === "not_completed"
  ).length;
  const pendingWorkloads = workloads.filter(
    (w) => w.status === "pending"
  ).length;

  const completionRate =
    totalWorkloads.length > 0
      ? (completedWorkloads / totalWorkloads.length) * 100
      : 0;

  const filteredWorkloads = workloads.filter((workloads) => {
    const recentWorkloads =
      !dateRange ||
      (workloads.dateTimeEnd?.toString() || "").includes(dateRange);

    return recentWorkloads;
  });

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
          <div
          // style={{
          //   display: window.innerWidth >= 768 ? "block" : "none",
          // }}
          >
            <Content style={{ maxWidth: "70dvw", margin: "0 auto" }}>
              <div
                style={{
                  marginBottom: theme.spacing.xl,
                  background: theme.white,
                  padding: theme.spacing.xl,
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                }}
              >
                <Title
                  level={3}
                  style={{
                    color: theme.primary,
                    fontWeight: theme.fontWeight.semibold,
                  }}
                >
                  {/* สรุปผลภาระงาน ( ประจำปี {new Date().getFullYear()} ) */}
                  สรุปผลภาระงาน ประจำเดือน
                </Title>

                <BarChart dataResponse={workloads} />
              </div>

              <div
                style={{
                  marginBottom: theme.spacing.xl,
                  background: theme.white,
                  padding: theme.spacing.xl,
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow,
                }}
              >
                <Title
                  level={3}
                  style={{
                    margin: 0,
                    color: theme.primary,
                    fontWeight: theme.fontWeight.semibold,
                  }}
                >
                  สัดส่วนภาระงานตามระดับความเร่งด่วน
                </Title>
                <div
                  style={{
                    height: "50dvh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Doughnuts dataResponse={workloads} />
                </div>
              </div>
            </Content>
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default HeadChart;
