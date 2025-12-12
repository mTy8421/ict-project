import React, { useState, useEffect } from "react";
import { Typography, Layout } from "antd";
import axiosInstance from "../../utils/axios";
import theme from "../../theme";
import DeanHeader from "../../components/dean/Header";
import DeanNavbar from "../../components/dean/Navbar";
import ReHeader from "../../components/dean/NavbarHeader";

import { BarChart } from "../../lib/head/barChart";
import { Doughnuts } from "../../lib/head/doughnutChart";
import { Horizontal } from "../../lib/dean/horizontal";

const { Content } = Layout;
const { Title, Text } = Typography;

interface Workload {
  id: number;
  description: string;
  department: string;
  status: "pending" | "not_completed" | "completed";
  startTime: string;
  options: any;
}

const DeanHome: React.FC = () => {
  const [workloads, setWorkloads] = useState<Workload[]>([]);

  const fetchWorkloads = async () => {
    try {
      const response = await axiosInstance.get("/work");
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
                  เวลาเฉลี่ยที่ใช้ในการทำงาน
                </Title>

                <Text
                  style={{
                    display: "block",
                    marginBottom: theme.spacing.sm,
                    textAlign: "center",
                    fontSize: "2rem",
                  }}
                >
                  {workloads.length > 0
                    ? (
                      workloads.reduce((sum, work) => {
                        const [hours, minutes, seconds] = work.startTime
                          .split(":")
                          .map(Number);
                        return (
                          sum +
                          (hours || 0) +
                          (minutes || 0) / 60 +
                          (seconds || 0) / 3600
                        );
                      }, 0) / workloads.length
                    ).toFixed(1)
                    : 0}{" "}
                  ชั่วโมง
                </Text>
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
                    color: theme.primary,
                    fontWeight: theme.fontWeight.semibold,
                  }}
                >
                  {/* สรุปผลภาระงาน ( ประจำปี {new Date().getFullYear()} ) */}
                  สรุปผลภาระงาน ประจำเดือน
                </Title>
                <div>
                  <Horizontal dataResponse={workloads} />
                </div>
                <div>
                  <BarChart dataResponse={workloads} />
                </div>
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
                    display: window.innerWidth >= 768 ? "flex" : "block",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Doughnuts dataResponse={workloads} />
                  {/* <Doughnuts dataResponse={workloads} /> */}
                </div>
              </div>
            </Content>
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DeanHome;
