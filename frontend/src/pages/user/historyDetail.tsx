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
  Upload,
  type UploadProps,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
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
  title: number;
  department: string;
  assignee: string;
  description: string;
  dateRange: [any, any];
}

interface User {
  user_id: number;
  user_name: string;
  user_role: string;
}

interface OptionsConfig {
  id: number;
  title: number;
  priority: string;
}

const UserHistoryDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const [profile, setProfile] = useState<User | undefined>();
  const [options, setOptions] = useState<OptionsConfig[]>([]);

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
        navigate("/");
      } else {
        message.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      }
    }
  };

  const fetchOptions = async () => {
    try {
      const response = await axiosInstance.get("/option");
      setOptions(response.data);
    } catch (error: any) {
      console.error("Error, fetching Options ", error);
    }
  };

  const fetchWorkload = async () => {
    try {
      const response = await axiosInstance.get(`/work/${id}`);
      const workload = response.data;

      form.setFieldsValue({
        title: workload.options.title,
        department: workload.department,
        description: workload.description,
        dateRange: [
          moment(workload.dateTimeStart),
          moment(workload.dateTimeEnd),
        ],
      });
    } catch (error: any) {
      console.error("Error fetching workload:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchWorkload();
    fetchOptions();
  }, [navigate]);

  const onFinish = async (values: WorkloadForm) => {
    try {
      setLoading(true);
      const [dateStart, dateEnd] = values.dateRange;

      // const setDate = new Date();

      const workloadData = {
        description: values.description,
        dateTimeStart: dateStart.format("YYYY-MM-DD"),
        dateTimeEnd: dateEnd.format("YYYY-MM-DD"),
        status: "pending",
      };

      console.log("Sending data:", workloadData);

      const response = await axiosInstance.patch(`/work/${id}`, workloadData);
      console.log("Response:", response.data);

      message.success("เพิ่มภาระงานสำเร็จ");
      navigate("/user/work");
    } catch (error: any) {
      console.error("Error creating workload:", error);
      message.error(
        error.response?.data?.message || "ไม่สามารถเพิ่มภาระงานได้",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: theme.background }}>
      <div className="hidden md:block">
        <DeanHeader />
      </div>

      <div className="md:hidden">
        <ReHeader />
      </div>

      <Layout style={{ height: "calc(100vh - 70px)" }}>
        <div className="hidden md:block">
          <DeanNavbar />
        </div>
        <Layout style={{ padding: theme.spacing.xl, overflow: "auto" }}>
          <div className="hidden md:block">
            <Content
              style={{
                maxWidth: "1200px",
                margin: "0 15%",
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
                  กลับไปหน้ารายการภาระงาน
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
                  รายละเอียดภาระงาน
                </Title>
                <Text
                  style={{
                    color: theme.textLight,
                    marginTop: theme.spacing.sm,
                    display: "block",
                    fontSize: theme.fontSize.md,
                  }}
                >
                  ข้อมูลรายละเอียดภาระงานภาระงานที่ต้องทำ
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
                          placeholder="กรอกหัวข้อภาระงาน"
                          style={{
                            height: 48,
                            borderRadius: theme.borderRadius.md,
                            fontSize: theme.fontSize.md,
                            padding: `0 ${theme.spacing.md}`,
                            borderColor: theme.textLight,
                            width: "100%",
                          }}
                          disabled
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        name="dateRange"
                        label="ระยะเวลา"
                        rules={[
                          { required: true, message: "กรุณาเลือกระยะเวลา" },
                        ]}
                      >
                        <DatePicker
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
                </Form>
              </Card>
            </Content>
          </div>

          <div className="md:hidden">
            <Content
              style={{
                width: "100%",
                margin: "0 auto",
                // padding: `0 ${theme.spacing.xl}`,
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
                  กลับไปหน้ารายการภาระงาน
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
                  รายละเอียดภาระงาน
                </Title>
                <Text
                  style={{
                    color: theme.textLight,
                    marginTop: theme.spacing.sm,
                    display: "block",
                    fontSize: theme.fontSize.md,
                  }}
                >
                  ข้อมูลรายละเอียดภาระงานภาระงานที่ต้องทำ
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
                          placeholder="กรอกหัวข้อภาระงาน"
                          style={{
                            height: 48,
                            borderRadius: theme.borderRadius.md,
                            fontSize: theme.fontSize.md,
                            padding: `0 ${theme.spacing.md}`,
                            borderColor: theme.textLight,
                            width: "100%",
                          }}
                          disabled
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        name="dateRange"
                        label="ระยะเวลา"
                        rules={[
                          { required: true, message: "กรุณาเลือกระยะเวลา" },
                        ]}
                      >
                        <DatePicker
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
                </Form>
              </Card>
            </Content>
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default UserHistoryDetail;
