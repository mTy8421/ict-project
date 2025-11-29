import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  Layout,
  Row,
  Col,
  Divider,
  message,
  Upload,
  TimePicker,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../utils/axios";
import theme from "../../theme";
import DeanHeader from "../../components/head/Header";
import DeanNavbar from "../../components/head/Navbar";
import ReHeader from "../../components/head/NavbarHeader";
import "./workload-new.override.css";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

interface WorkloadForm {
  title: number;
  department: string;
  assignee: string;
  description: string;
  startTime: any;
  fileUpload: any;
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

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const HeadWorkLoadAdd: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<User | undefined>();
  const [options, setOptions] = useState<OptionsConfig[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/user/profile");
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
      console.error("Error, fetching Options", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchOptions();
  }, [navigate]);

  const onFinish = async (values: WorkloadForm) => {
    try {
      setLoading(true);
      const { startTime } = values;
      const formData = new FormData();
      formData.append("description", values.description);
      formData.append("department", profile?.user_role || "unknown");
      formData.append("user", String(profile?.user_id || 0));
      formData.append("options", String(values.title));
      formData.append("startTime", startTime.format("HH:mm"));
      formData.append("status", "pending");

      if (values.fileUpload && values.fileUpload.length > 0) {
        for (const file of values.fileUpload) {
          formData.append("fileUpload", file.originFileObj);
        }
      }

      const response = await axiosInstance.post("/work", formData);

      console.log("Response:", response.data);

      message.success("เพิ่มภาระงานสำเร็จ");
      navigate("/head/_workload");
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
                  onClick={() => navigate("/head/_workload")}
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
                  เพิ่มภาระงานใหม่
                </Title>
                <Text
                  style={{
                    color: theme.textLight,
                    marginTop: theme.spacing.sm,
                    display: "block",
                    fontSize: theme.fontSize.md,
                  }}
                >
                  กรอกข้อมูลภาระงานที่ต้องการเพิ่ม
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
                styles={{
                  body: {
                    padding: `${theme.spacing.xxl} ${theme.spacing.xl}`,
                  },
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
                    <Col span={16}>
                      <Form.Item
                        name="title"
                        label="หัวข้อภาระงาน"
                        rules={[
                          { required: true, message: "กรุณากรอกหัวข้อภาระงาน" },
                        ]}
                      >
                        <Select
                          placeholder="เลือกหัวข้อภาระงาน"
                          style={{
                            height: 48,
                            borderRadius: theme.borderRadius.md,
                            fontSize: theme.fontSize.md,
                            padding: `0 ${theme.spacing.md}`,
                            borderColor: theme.textLight,
                            width: "100%",
                          }}
                        >
                          {options.map((opt) => (
                            <Select.Option key={opt.id} value={opt.id}>
                              {opt.title}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        name="startTime"
                        label="ระยะเวลาที่ใช้"
                        rules={[
                          {
                            required: true,
                            message: "กรุณาเลือกระยะเวลาที่ใช้",
                          },
                        ]}
                      >
                        <TimePicker
                          style={{
                            height: 48,
                            borderRadius: theme.borderRadius.md,
                            fontSize: theme.fontSize.md,
                            padding: `0 ${theme.spacing.md}`,
                            borderColor: theme.textLight,
                            width: "100%",
                          }}
                          format="HH:mm"
                          placeholder="เลือกระยะเวลาที่ใช้"
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

                    <Col span={24}>
                      <Form.Item
                        name="fileUpload"
                        label="อัพโหลดรูปภาพ / PDF"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[
                          {
                            required: true,
                            message: "กรุณาอัปโหลดรูปภาพ / PDF",
                          },
                        ]}
                      >
                        <Upload
                          name="files"
                          beforeUpload={() => false}
                          listType="picture"
                          multiple
                        >
                          <Button icon={<UploadOutlined />}>อัปโหลดไฟล์</Button>
                        </Upload>
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
                      บันทึกภาระงาน
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
                  onClick={() => navigate("/head/_workload")}
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
                  เพิ่มภาระงานใหม่
                </Title>
                <Text
                  style={{
                    color: theme.textLight,
                    marginTop: theme.spacing.sm,
                    display: "block",
                    fontSize: theme.fontSize.md,
                  }}
                >
                  กรอกข้อมูลภาระงานที่ต้องการเพิ่ม
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
                styles={{
                  body: {
                    padding: `${theme.spacing.xxl} ${theme.spacing.xl}`,
                  },
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
                    <Col span={16}>
                      <Form.Item
                        name="title"
                        label="หัวข้อภาระงาน"
                        rules={[
                          { required: true, message: "กรุณากรอกหัวข้อภาระงาน" },
                        ]}
                        style={{ width: "100%" }}
                      >
                        <Select
                          placeholder="เลือกหัวข้อภาระงาน"
                          style={{
                            height: 48,
                            borderRadius: theme.borderRadius.md,
                            fontSize: theme.fontSize.md,
                            padding: `0 ${theme.spacing.md}`,
                            borderColor: theme.textLight,
                            width: "100%",
                          }}
                        >
                          {options.map((opt) => (
                            <Select.Option key={opt.id} value={opt.id}>
                              {opt.title}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        name="startTime"
                        label="ระยะเวลาที่ใช้"
                        rules={[
                          {
                            required: true,
                            message: "กรุณาเลือกระยะเวลาที่ใช้",
                          },
                        ]}
                      >
                        <TimePicker
                          style={{
                            height: 48,
                            borderRadius: theme.borderRadius.md,
                            fontSize: theme.fontSize.md,
                            padding: `0 ${theme.spacing.md}`,
                            borderColor: theme.textLight,
                            width: "100%",
                          }}
                          format="HH:mm"
                          placeholder="เลือกระยะเวลาที่ใช้"
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

                    <Col span={24}>
                      <Form.Item
                        name="fileUpload"
                        label="อัพโหลดรูปภาพ / PDF"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[
                          {
                            required: true,
                            message: "กรุณาอัปโหลดรูปภาพ / PDF",
                          },
                        ]}
                      >
                        <Upload
                          name="files"
                          beforeUpload={() => false}
                          listType="picture"
                          multiple
                        >
                          <Button icon={<UploadOutlined />}>อัปโหลดไฟล์</Button>
                        </Upload>
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
                      บันทึกภาระงาน
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

export default HeadWorkLoadAdd;
