import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import DeanHeader from "../../components/admin/Header";
import DeanNavbar from "../../components/admin/Navbar";
import ReHeader from "../../components/admin/NavbarHeader";
import "./workload-new.override.css";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface WorkloadForm {
  user_name: string;
  user_email: string;
  user_role: string;
  user_password: string;
}

interface User {
  user_id: number;
  user_name: string;
  user_role: string;
}

const AdminWorkLoad: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const [role, setRole] = useState("admin");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/user/profile");
        setUser(response.data);
      } catch (error: any) {
        console.error("Error fetching user:", error);
        if (error.response?.status === 401) {
          message.error("กรุณาเข้าสู่ระบบใหม่");
          navigate("/login");
        } else {
          message.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
        }
      }
    };

    fetchUser();
  }, [navigate]);

  const onFinish = async (values: WorkloadForm) => {
    try {
      setLoading(true);
      const workloadData = {
        user_name: values.user_name,
        user_email: values.user_email,
        user_role: role,
        user_password: values.user_password,
      };

      console.log("Sending data:", workloadData);

      const response = await axiosInstance.post("/user", workloadData);
      console.log("Response:", response.data);

      message.success("เพิ่มภาระงานสำเร็จ");
      navigate("/admin");
    } catch (error: any) {
      console.error("Error creating workload:", error);
      message.error(
        error.response?.data?.message || "ไม่สามารถเพิ่มผู้ใช้งานได้",
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
                onClick={() => navigate("/admin")}
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
                กลับไปหน้ารายการภาระงานภาพรวม
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
                เพิ่มผู้ใช้งาน
              </Title>
              <Text
                style={{
                  color: theme.textLight,
                  marginTop: theme.spacing.sm,
                  display: "block",
                  fontSize: theme.fontSize.md,
                }}
              >
                กรอกข้อมูลผู้ใช้ที่ต้องการเพิ่ม
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
                      name="user_name"
                      label="ชื่อผู้ใช้"
                      rules={[
                        { required: true, message: "กรุณากรอกชื่อผู้ใช้" },
                      ]}
                      style={{ width: "100%" }}
                    >
                      <Input
                        placeholder="กรอกชื่อผู้ใช้"
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
                  <Col span={24}>
                    <Form.Item
                      name="user_email"
                      label="อีเมล"
                      rules={[{ required: true, message: "กรุณากรอกอีเมล" }]}
                      style={{ width: "100%" }}
                    >
                      <Input
                        placeholder="กรอกอีเมล"
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
                  <Col span={24}>
                    <Form.Item
                      name="user_password"
                      label="รหัสผ่าน"
                      rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
                      style={{ width: "100%" }}
                    >
                      <Input
                        placeholder="กรอกรหัสผ่าน"
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
                  <Col span={24}>
                    <Form.Item
                      name="user_role"
                      label="ตำแหน่ง"
                      style={{ width: "100%" }}
                    >
                      <Select
                        defaultValue="admin"
                        onChange={(value) => {
                          setRole(value);
                        }}
                        style={{
                          height: 48,
                          borderRadius: theme.borderRadius.md,
                          fontSize: theme.fontSize.md,
                          padding: `0 ${theme.spacing.md}`,
                          borderColor: theme.textLight,
                          width: "100%",
                        }}
                        options={[
                          {
                            label: <span>พนักงาน</span>,
                            title: "พนักงาน",
                            options: [
                              { label: <span>admin</span>, value: "admin" },
                              {
                                label: <span>หัวหน้าสำนักงาน</span>,
                                value: "หัวหน้าสำนักงาน",
                              },
                              {
                                label: (
                                  <span>พนักงานฝ่ายวิจัยและนวัตถกรรม</span>
                                ),
                                value: "พนักงานฝ่ายวิจัยและนวัตถกรรม",
                              },
                              {
                                label: <span>พนักงานฝ่ายคุณภาพนิสิต</span>,
                                value: "พนักงานฝ่ายคุณภาพนิสิต",
                              },
                              {
                                label: (
                                  <span>
                                    พนักงานฝ่ายยุทธศาสตร์และพัฒนาองค์กร
                                  </span>
                                ),
                                value: "พนักงานฝ่ายยุทธศาสตร์และพัฒนาองค์กร",
                              },
                              {
                                label: <span>พนักงานฝ่ายวิชาการ</span>,
                                value: "พนักงานฝ่ายวิชาการ",
                              },
                            ],
                          },
                          {
                            label: <span>คณบดี</span>,
                            title: "คณบดี",
                            options: [
                              { label: <span>คณบดี</span>, value: "คณบดี" },
                              {
                                label: (
                                  <span>คณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร</span>
                                ),
                                value: "คณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร",
                              },
                              {
                                label: <span>รองคณบดีฝ่ายวิชาการ</span>,
                                value: "รองคณบดีฝ่ายวิชาการ",
                              },
                              {
                                label: (
                                  <span>รองคณบดีฝ่ายวิจัยและนวัตถกรรม</span>
                                ),
                                value: "รองคณบดีฝ่ายวิจัยและนวัตถกรรม",
                              },
                              {
                                label: <span>รองคณบดีฝ่ายคุณภาพนิสิต</span>,
                                value: "รองคณบดีฝ่ายคุณภาพนิสิต",
                              },
                            ],
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider style={{ margin: `${theme.spacing.xl} 0` }} />

                <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
                  <Button
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
                    บันทึกผู้ใช้งาน
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminWorkLoad;
