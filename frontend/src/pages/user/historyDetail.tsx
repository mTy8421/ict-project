import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Card,
  Typography,
  Layout,
  Row,
  Col,
  Divider,
  message,
  Image,
  TimePicker,
} from "antd";
import { ArrowLeftOutlined, FilePdfOutlined } from "@ant-design/icons";
import axiosInstance from "../../utils/axios";
import theme from "../../theme";
import DeanHeader from "../../components/user/Header";
import DeanNavbar from "../../components/user/Navbar";
import ReHeader from "../../components/user/NavbarHeader";
import "./workload-new.override.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface ImageFile {
  id: number;
  file_name: string;
}

const UserHistoryDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [images, setImages] = useState<ImageFile[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await axiosInstance.get("/user/profile");
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

    const fetchWorkload = async () => {
      try {
        const response = await axiosInstance.get(`/work/${id}`);
        const workload = response.data;

        const imagesResponse = await axiosInstance.get(
          `upload-file/show/id/${id}`
        );
        setImages(imagesResponse.data);

        form.setFieldsValue({
          title: workload.options.title,
          department: workload.department,
          description: workload.description,
          startTime: workload.startTime ? dayjs(workload.startTime, "HH:mm") : null,
        });
      } catch (error: any) {
        console.error("Error fetching workload:", error);
      }
    };

    fetchUsers();
    fetchWorkload();
  }, [id, form]);

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
                          ) : null
                        )}
                      </div>
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
                styles={{
                  body: {
                    padding: `${theme.spacing.xxl} ${theme.spacing.xl}`,
                  },
                }}
              >
                <Form
                  form={form}
                  layout="vertical"
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
                          ) : null
                        )}
                      </div>
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
