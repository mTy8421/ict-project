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
import axiosInstance from "../../../utils/axios";
import theme from "../../../theme";
import DeanHeader from "../../../components/admin/Header";
import DeanNavbar from "../../../components/admin/Navbar";
import ReHeader from "../../../components/admin/NavbarHeader";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface WorkloadForm {
  title: string;
  priority: string;
}

interface User {
  user_id: number;
  user_name: string;
  user_role: string;
}

const Priority: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("/user/profile");
      setUser(response.data);
    } catch (error: any) {
      console.error("Error fetching user:", error);
      if (error.response?.status === 401) {
        message.error("กรุณาเข้าสู่ระบบใหม่");
        navigate("/");
      } else {
        message.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [navigate]);

  const onFinish = async (values: WorkloadForm) => {
    try {
      setLoading(true);
      const workloadData = {
        title: values.title,
        priority: values.priority,
      };

      console.log("Sending data:", workloadData);

      const response = await axiosInstance.post("/option", workloadData);
      console.log("Response:", response.data);

      message.success("เพิ่มภาระงานสำเร็จ");
      navigate("/admin/config/priority");
    } catch (error: any) {
      console.error("Error creating workload:", error);
      message.error(
        error.response?.data?.message || "ไม่สามารถเพิ่มผู้ใช้งานได้"
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
                  onClick={() => navigate("/admin/config/priority")}
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
                  กลับไปหน้ารายงานระดับความเร่งด่วน
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
                  ระดับความเร่งด่วน
                </Title>
                <Text
                  style={{
                    color: theme.textLight,
                    marginTop: theme.spacing.sm,
                    display: "block",
                    fontSize: theme.fontSize.md,
                  }}
                >
                  ตั่งค่าความสำคัญของภาระงาน
                </Text>
              </div>

              <Card
                style={{
                  // maxWidth: 800,
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
                          { required: true, message: "กรุณากรอกชื่อผู้ใช้" },
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
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="priority"
                        label="ระดับความเร่งด่วน"
                        rules={[
                          { required: true, message: "กรุณาเลือกความสำคัญ" },
                        ]}
                      >
                        <Select
                          placeholder="เลือกระดับความเร่งด่วน"
                          style={{
                            height: 48,
                            borderRadius: theme.borderRadius.md,
                            fontSize: theme.fontSize.md,
                            padding: `0 ${theme.spacing.md}`,
                            borderColor: theme.textLight,
                            width: "100%",
                          }}
                        >
                          <Select.Option value="high">สูง</Select.Option>
                          <Select.Option value="medium">ปานกลาง</Select.Option>
                          <Select.Option value="low">ต่ำ</Select.Option>
                        </Select>
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
                      บันทึก
                    </Button>
                  </Form.Item>
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
                  onClick={() => navigate("/admin/config/priority")}
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
                  กลับไปหน้ารายงานระดับความเร่งด่วน
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
                  ระดับความเร่งด่วน
                </Title>
                <Text
                  style={{
                    color: theme.textLight,
                    marginTop: theme.spacing.sm,
                    display: "block",
                    fontSize: theme.fontSize.md,
                  }}
                >
                  ตั่งค่าความสำคัญของภาระงาน
                </Text>
              </div>

              <Card
                style={{
                  // maxWidth: 800,
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
                          { required: true, message: "กรุณากรอกชื่อผู้ใช้" },
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
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="priority"
                        label="ระดับความเร่งด่วน"
                        rules={[
                          { required: true, message: "กรุณาเลือกความสำคัญ" },
                        ]}
                      >
                        <Select
                          placeholder="เลือกระดับความเร่งด่วน"
                          style={{
                            height: 48,
                            borderRadius: theme.borderRadius.md,
                            fontSize: theme.fontSize.md,
                            padding: `0 ${theme.spacing.md}`,
                            borderColor: theme.textLight,
                            width: "100%",
                          }}
                        >
                          <Select.Option value="high">สูง</Select.Option>
                          <Select.Option value="medium">ปานกลาง</Select.Option>
                          <Select.Option value="low">ต่ำ</Select.Option>
                        </Select>
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
                      บันทึก
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Content>
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Priority;
