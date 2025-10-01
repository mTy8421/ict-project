import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import axiosInstance from "../../utils/axios";
import theme from "../../theme";
import DeanHeader from "../../components/head/Header";
import DeanNavbar from "../../components/head/Navbar";
import ReHeader from "../../components/head/NavbarHeader";

import { BarChart } from "../../lib/user/barChart";
import { Doughnuts } from "../../lib/user/doughnutChart";

const { Content } = Layout;
const { Title, Text } = Typography;

interface Workload {
  id: number;
  // title: string;
  description: string;
  department: string;
  // priority: "low" | "medium" | "high";
  status: "pending" | "not_completed" | "completed";
  dateTimeStart: string;
  dateTimeEnd: string;
  options: any;
}

const HeadWorkStatus: React.FC = () => {
  const { id } = useParams();
  const [workloads, setWorkloads] = useState<Workload[]>([]);

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

export default HeadWorkStatus;
