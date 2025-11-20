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
  Image,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import axiosInstance from "../../utils/axios";
import theme from "../../theme";
import DeanHeader from "../../components/head/Header";
import DeanNavbar from "../../components/head/Navbar";
import ReHeader from "../../components/head/NavbarHeader";
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
  fileUpload: any;
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

const HeadWorkLoadEdit: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<OptionsConfig[]>([]);
  const { id } = useParams();

  const [images, setImages] = useState<ImageFile[]>([]);

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
      const response = await axiosInstance.get(`work/${id}`);
      const workload = response.data;

      const imagesResponse = await axiosInstance.get(
        `upload-file/show/id/${id}`
      );
      setImages(imagesResponse.data);

      form.setFieldsValue({
        title: workload.options.id,
        department: workload.department,
        description: workload.description,
        dateRange:
          workload.dateTimeStart && workload.dateTimeEnd
            ? [moment(workload.dateTimeStart), moment(workload.dateTimeEnd)]
            : undefined,
      });
    } catch (error: any) {
      console.error("Error, fetching workload ", error);
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

      const payload = {
        description: values.description,
        options: String(values.title),
        dateTimeStart: dateStart.format("YYYY-MM-DD"),
        dateTimeEnd: dateEnd.format("YYYY-MM-DD"),
      };

      const formData = new FormData();
      if (values.fileUpload && values.fileUpload.length > 0) {
        for (const file of values.fileUpload) {
          formData.append("fileUpload", file.originFileObj);
        }
      }

      console.log("Sending data:", payload);

      const response = await axiosInstance.patch(`/work/${id}`, payload);
      console.log("Response:", response.data);

      message.success("แก้ไขภาระงานสำเร็จ");
      navigate("/head/_workload");
    } catch (error: any) {
      console.error("Error updating workload:", error);
      message.error(
        error.response?.data?.message || "ไม่สามารถแก้ไขภาระงานได้"
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
                  แก้ไขภาระงาน
                </Title>
                <Text
                  style={{
                    color: theme.textLight,
                    marginTop: theme.spacing.sm,
                    display: "block",
                    fontSize: theme.fontSize.md,
                  }}
                >
                  แก้ไขข้อมูลภาระงานที่ต้องการ
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

                    <Col span={24}>
                      <Form.Item
                        name="dateRange"
                        label="ระยะเวลา"
                        rules={[
                          { required: true, message: "กรุณาเลือกระยะเวลา" },
                        ]}
                      >
                        <RangePicker
                          style={{
                            height: 48,
                            borderRadius: theme.borderRadius.md,
                            fontSize: theme.fontSize.md,
                            padding: `0 ${theme.spacing.md}`,
                            borderColor: theme.textLight,
                            width: "100%",
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
                maxWidth: "1200px",
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
                  แก้ไขภาระงาน
                </Title>
                <Text
                  style={{
                    color: theme.textLight,
                    marginTop: theme.spacing.sm,
                    display: "block",
                    fontSize: theme.fontSize.md,
                  }}
                >
                  แก้ไขข้อมูลภาระงานที่ต้องการ
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

                    <Col span={24}>
                      <Form.Item
                        name="dateRange"
                        label="ระยะเวลา"
                        rules={[
                          { required: true, message: "กรุณาเลือกระยะเวลา" },
                        ]}
                      >
                        <RangePicker
                          style={{
                            height: 48,
                            borderRadius: theme.borderRadius.md,
                            fontSize: theme.fontSize.md,
                            padding: `0 ${theme.spacing.md}`,
                            borderColor: theme.textLight,
                            width: "100%",
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

export default HeadWorkLoadEdit;
