import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  Typography,
  Layout,
  Row,
  Col,
  Divider,
  message,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import axiosInstance from "../../utils/axios";
import theme from "../../theme";
import DeanHeader from "../../components/user/Header";
import DeanNavbar from "../../components/user/Navbar";
import ReHeader from "../../components/user/NavbarHeader";
import "./workload-new.override.css";
import moment from "moment";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface WorkloadForm {
  title: string;
  department: string;
  assignee: string;
  priority: "low" | "medium" | "high";
  description: string;
  dateRange: [any, any];
}

interface User {
  user_id: number;
  user_name: string;
  user_role: string;
}

const UserHistoryDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const [profile, setProfile] = useState<User | undefined>();

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return theme.danger;
      case "medium":
        return theme.warning;
      case "low":
        return theme.success;
      default:
        return theme.textLight;
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/user/profile");
      setUsers(response.data);
      setProfile(response.data);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) {
        message.error("กรุณาเข้าสู่ระบบใหม่");
        navigate("/login");
      } else {
        message.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      }
    }
  };

  const fetchWorkload = async () => {
    try {
      const response = await axiosInstance.get(`/workload/edit/${id}`);
      const workload = response.data;

      form.setFieldsValue({
        title: workload.title,
        department: workload.department,
        assignee: workload.assignedTo.user_id,
        priority: workload.priority,
        description: workload.description,
        dateRange: [moment(workload.start_date), moment(workload.end_date)],
      });
    } catch (error: any) {
      console.error("Error fetching workload:", error);
      message.error("ไม่สามารถดึงข้อมูลภาระงานได้");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchWorkload();
  }, [navigate]);
  const onFinish = async (values: WorkloadForm) => {
    try {
      setLoading(true);
      const [start_date, end_date] = values.dateRange;

      const workloadData = {
        title: values.title,
        department: profile?.user_role || "unknown",
        assignedToId: profile?.user_id || 0,
        priority: values.priority,
        description: values.description,
        start_date: start_date.format("YYYY-MM-DD"),
        end_date: end_date.format("YYYY-MM-DD"),
        status: "pending",
      };

      console.log("Sending data:", workloadData);

      const response = await axiosInstance.put(
        `/workload/edit/${id}`,
        workloadData
      );
      console.log("Response:", response.data);

      message.success("เพิ่มภาระงานสำเร็จ");
      navigate("/user/work");
    } catch (error: any) {
      console.error("Error creating workload:", error);
      message.error(
        error.response?.data?.message || "ไม่สามารถเพิ่มภาระงานได้"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: theme.background }}>
      <div className="hidden md:block">
        <DeanHeader name="test" />
      </div>
      <div className="md:hidden">
        <ReHeader />
      </div>
      <Layout style={{ height: "calc(100vh - 70px)" }}>
        <div className="hidden md:block">
          <DeanNavbar />
        </div>
        <Layout style={{ padding: theme.spacing.xl, overflow: "auto" }}>
          <Content
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: `0 ${theme.spacing.xl}`,
            }}
          >
            <div
              style={{
                marginBottom: theme.spacing.xl,
                background: theme.white,
                padding: theme.spacing.xl,
                borderRadius: theme.borderRadius.lg,
                boxShadow: theme.shadow,
              }}
            >
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/user/history")}
                style={{
                  padding: 0,
                  marginBottom: theme.spacing.md,
                  color: theme.primary,
                  fontSize: theme.fontSize.md,
                  height: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.sm,
                }}
              >
                กลับไปหน้าประวัติภาระงาน
              </Button>
              <Title
                level={3}
                style={{
                  margin: 0,
                  color: theme.primary,
                  fontWeight: theme.fontWeight.semibold,
                  fontSize: theme.fontSize.xxl,
                  letterSpacing: "0.5px",
                }}
              >
                ประวัติภาระงาน
              </Title>
              <Text
                style={{
                  color: theme.textLight,
                  marginTop: theme.spacing.sm,
                  display: "block",
                  fontSize: theme.fontSize.md,
                }}
              >
                ดูรายระเอียดประวัติภาระงานภาระงาน
              </Text>
            </div>

            <Card
              style={{
                maxWidth: 800,
                margin: `${theme.spacing.xl} auto`,
                borderRadius: theme.borderRadius.lg,
                boxShadow: theme.shadow,
                background: theme.white,
                padding: 0,
              }}
              bodyStyle={{
                padding: `${theme.spacing.xxl} ${theme.spacing.xl}`,
              }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
                size="large"
                style={{ width: "100%" }}
              >
                <Row gutter={[32, 24]}>
                  <Col span={24}>
                    <Form.Item
                      name="title"
                      label="หัวข้อภาระงาน"
                      rules={[
                        { required: true, message: "กรุณากรอกหัวข้อภาระงาน" },
                      ]}
                      style={{ width: "100%" }}
                    >
                      <Input
                        disabled
                        placeholder="กรอกหัวข้อภาระงาน"
                        style={{
                          height: 48,
                          borderRadius: theme.borderRadius.md,
                          fontSize: theme.fontSize.md,
                          padding: `0 ${theme.spacing.md}`,
                          borderColor: theme.textLight,
                          width: "100%",
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="priority"
                      label="ความสำคัญ"
                      rules={[
                        { required: true, message: "กรุณาเลือกความสำคัญ" },
                      ]}
                    >
                      <Select
                        disabled
                        placeholder="เลือกความสำคัญ"
                        style={{
                          height: 48,
                          borderRadius: theme.borderRadius.md,
                          fontSize: theme.fontSize.md,
                        }}
                      >
                        <Select.Option value="high">สูง</Select.Option>
                        <Select.Option value="medium">ปานกลาง</Select.Option>
                        <Select.Option value="low">ต่ำ</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="dateRange"
                      label="ระยะเวลา"
                      rules={[
                        { required: true, message: "กรุณาเลือกระยะเวลา" },
                      ]}
                    >
                      <RangePicker
                        disabled
                        style={{
                          width: "100%",
                          height: 48,
                          borderRadius: theme.borderRadius.md,
                          fontSize: theme.fontSize.md,
                        }}
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      name="description"
                      label="รายละเอียด"
                      rules={[
                        { required: true, message: "กรุณากรอกรายละเอียด" },
                      ]}
                    >
                      <TextArea
                        disabled
                        placeholder="กรอกรายละเอียดภาระงาน"
                        rows={4}
                        style={{
                          borderRadius: theme.borderRadius.md,
                          fontSize: theme.fontSize.md,
                          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                          resize: "none",
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider style={{ margin: `${theme.spacing.xl} 0` }} />

                <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
                  {/* <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                    style={{
                      height: 48,
                      minWidth: 180,
                      fontSize: theme.fontSize.md,
                      borderRadius: theme.borderRadius.md,
                      fontWeight: theme.fontWeight.semibold,
                      boxShadow: theme.shadow,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: theme.spacing.sm,
                    }}
                  >
                    บันทึกภาระงาน
                  </Button> */}
                </Form.Item>
              </Form>
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default UserHistoryDetail;
