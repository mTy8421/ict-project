import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  Image,
  TimePicker,
} from "antd";
import {
  ArrowLeftOutlined,
  FilePdfOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../utils/axios";
import theme from "../../theme";
import DeanHeader from "../../components/head/Header";
import DeanNavbar from "../../components/head/Navbar";
import ReHeader from "../../components/head/NavbarHeader";
import "./workload-new.override.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface WorkloadForm {
  title: number;
  department: string;
  assignee: string;
  description: string;
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

interface ImageFile {
  id: number;
  file_name: string;
}

const DetailHeadWorkLoad: React.FC = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [buttonAction, setButtonAction] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingSencond, setLoadingSencond] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const [profile, setProfile] = useState<User | undefined>();
  const [options, setOptions] = useState<OptionsConfig[]>([]);

  const [images, setImages] = useState<ImageFile[]>([]);

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

      const imagesResponse = await axiosInstance.get(
        `upload-file/show/id/${id}`,
      );
      setImages(imagesResponse.data);

      form.setFieldsValue({
        title: workload.options.title,
        department: workload.department,
        description: workload.description,
        startTime: workload.startTime
          ? dayjs(workload.startTime, "HH:mm")
          : null,
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
      if (buttonAction === "completed") {
        setLoading(true);
      } else {
        setLoadingSencond(true);
      }

      const workloadData = {
        description: values.description,
        status: buttonAction,
      };

      await axiosInstance.patch(`/work/${id}`, workloadData);

      message.success("เพิ่มภาระงานสำเร็จ");
      navigate(`/head/work/user/${searchParams.get("uid")}`);
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
                  onClick={() =>
                    navigate(`/head/work/user/${searchParams.get("uid")}`)
                  }
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
                  กลับไปหน้ารายการอนุมัติภาระงาน
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
                  ข้อมูลรายละเอียดภาระงานภาระงาน
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

                    <Col span={8}>
                      <Form.Item
                        name="startTime"
                        label="ระยะเวลา"
                        rules={[
                          { required: true, message: "กรุณาเลือกระยะเวลา" },
                        ]}
                      >
                        <TimePicker
                          disabled
                          style={{
                            width: "100%",
                            height: 48,
                            borderRadius: theme.borderRadius.md,
                            fontSize: theme.fontSize.md,
                          }}
                          format="HH:mm"
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

                    <Col span={24}>
                      <div>
                        {images
                          .filter((item) => !item.file_name.endsWith(".pdf"))
                          .map((item, index) => (
                            <Image
                              key={index}
                              width={200}
                              src={`/api/upload-file/show/${item.file_name}`}
                            />
                          ))}
                      </div>
                    </Col>

                    <Col span={24}>
                      <div>
                        {images.map((item, index) =>
                          item.file_name.endsWith(".pdf") ? (
                            <div
                              key={index}
                              style={{ marginBottom: theme.spacing.md }}
                            >
                              <a
                                href={`/api/upload-file/showPdf/${item.file_name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: theme.primary,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: theme.spacing.sm,
                                }}
                              >
                                <FilePdfOutlined
                                  style={{ fontSize: theme.fontSize.lg }}
                                />
                                {item.file_name}
                              </a>
                            </div>
                          ) : null,
                        )}
                      </div>
                    </Col>
                  </Row>

                  <Divider style={{ margin: `${theme.spacing.xl} 0` }} />

                  <Form.Item
                    style={{
                      marginBottom: 0,
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loadingSencond}
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
                        background: theme.danger,
                        marginRight: theme.spacing.lg,
                      }}
                      onClick={() => setButtonAction("not_completed")}
                    >
                      ไม่อนุมัติภาระงาน
                    </Button>

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
                        background: theme.success,
                        marginLeft: theme.spacing.lg,
                      }}
                      onClick={() => setButtonAction("completed")}
                    >
                      อนุมัติภาระงาน
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
                  onClick={() =>
                    navigate(`/head/work/user/${searchParams.get("uid")}`)
                  }
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
                  กลับไปหน้ารายการอนุมัติภาระงาน
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
                    fontSize: theme.fontSize.sm,
                  }}
                >
                  ข้อมูลรายละเอียดภาระงานภาระงาน
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

                    <Col span={24}>
                      <div>
                        {images
                          .filter((item) => !item.file_name.endsWith(".pdf"))
                          .map((item, index) => (
                            <Image
                              key={index}
                              width={200}
                              src={`/api/upload-file/show/${item.file_name}`}
                            />
                          ))}
                      </div>
                    </Col>

                    <Col span={24}>
                      <div>
                        {images.map((item, index) =>
                          item.file_name.endsWith(".pdf") ? (
                            <div
                              key={index}
                              style={{ marginBottom: theme.spacing.md }}
                            >
                              <a
                                href={`/api/upload-file/showPdf/${item.file_name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: theme.primary,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: theme.spacing.sm,
                                }}
                              >
                                <FilePdfOutlined
                                  style={{ fontSize: theme.fontSize.lg }}
                                />
                                {item.file_name}
                              </a>
                            </div>
                          ) : null,
                        )}
                      </div>
                    </Col>
                  </Row>

                  <Divider style={{ margin: `${theme.spacing.xl} 0` }} />

                  <Form.Item
                    style={{
                      marginBottom: 0,
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loadingSencond}
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
                        background: theme.danger,
                        marginRight: theme.spacing.lg,
                      }}
                      onClick={() => setButtonAction("not_completed")}
                    >
                      ไม่อนุมัติภาระงาน
                    </Button>

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
                        background: theme.success,
                        marginLeft: theme.spacing.lg,
                      }}
                      onClick={() => setButtonAction("completed")}
                    >
                      อนุมัติภาระงาน
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

export default DetailHeadWorkLoad;
