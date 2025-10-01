import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Card,
  Space,
  Typography,
  message,
  Select,
  DatePicker,
  Popconfirm,
  Alert,
  Layout,
  Row,
  Col,
  Divider,
  Tag,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import API from "../api/api";
import dayjs from "dayjs";

const { Title } = Typography;
const { Content, Header } = Layout;

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [prefixes, setPrefixes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [editingStudent, setEditingStudent] = useState(null);
  const [alert, setAlert] = useState(null);

  // โหลดข้อมูลนักเรียน
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/students");
      setStudents(res.data);
      setFilteredStudents(res.data);
    } catch (err) {
      setAlert({ type: "error", message: "ไม่สามารถโหลดข้อมูลนักเรียนได้" });
    } finally {
      setLoading(false);
    }
  };

  const fetchPrefixes = async () => {
    try {
      const res = await API.get("/prefixes");
      setPrefixes(res.data);
    } catch {
      setAlert({ type: "error", message: "โหลดคำนำหน้าไม่สำเร็จ" });
    }
  };

  const fetchGenders = async () => {
    try {
      const res = await API.get("/genders");
      setGenders(res.data);
    } catch {
      setAlert({ type: "error", message: "โหลดข้อมูลเพศไม่สำเร็จ" });
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchPrefixes();
    fetchGenders();
  }, []);

  // filter
  const onFilter = (values) => {
    let data = [...students];
    if (values.studentId) {
      data = data.filter((s) => String(s.id).includes(values.studentId));
    }
    if (values.name) {
      data = data.filter(
        (s) =>
          s.firstName.includes(values.name) ||
          s.lastName.includes(values.name)
      );
    }
    if (values.gradeLevelId) {
      data = data.filter((s) => s.gradeLevelId === values.gradeLevelId);
    }
    setFilteredStudents(data);
  };

  // add / edit
  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        birthDate: values.birthDate.format("YYYY-MM-DD"),
      };

      if (editingStudent) {
        await API.put(`/students/${editingStudent.id}`, payload);
        setAlert({ type: "success", message: "แก้ไขนักเรียนสำเร็จ" });
      } else {
        await API.post("/students", payload);
        setAlert({ type: "success", message: "เพิ่มนักเรียนสำเร็จ" });
      }

      fetchStudents();
      setVisible(false);
      form.resetFields();
      setEditingStudent(null);
    } catch {
      setAlert({ type: "error", message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
    }
  };

  const handleEdit = (record) => {
    setEditingStudent(record);
    setVisible(true);
    form.setFieldsValue({
      ...record,
      birthDate: record.birthDate ? dayjs(record.birthDate) : null,
    });
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/students/${id}`);
      setAlert({ type: "success", message: "ลบนักเรียนสำเร็จ" });
      fetchStudents();
    } catch {
      setAlert({ type: "error", message: "เกิดข้อผิดพลาดในการลบนักเรียน" });
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Header style={{ background: "#fff", padding: "0 24px" }}>
        <Title level={3} style={{ margin: 0 }}>
          📚 Student Management
        </Title>
      </Header>

      <Content style={{ padding: "24px" }}>
        {alert && (
          <Alert
            style={{ marginBottom: 16 }}
            type={alert.type}
            message={alert.message}
            showIcon
            closable
            onClose={() => setAlert(null)}
          />
        )}

        {/* ฟอร์มค้นหา */}
        <Card
          bordered={false}
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            marginBottom: "20px",
          }}
        >
          <Form form={filterForm} layout="inline" onFinish={onFilter}>
            <Row gutter={16} style={{ width: "100%" }}>
              <Col span={6}>
                <Form.Item name="studentId" label="รหัสนักเรียน">
                  <Input placeholder="ค้นหารหัส" allowClear />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="name" label="ชื่อ/นามสกุล">
                  <Input placeholder="ค้นหาชื่อหรือนามสกุล" allowClear />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="gradeLevelId" label="ระดับชั้น">
                  <InputNumber min={1} max={12} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  block
                >
                  ค้นหา
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* ตารางนักเรียน */}
        <Card
          bordered={false}
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Space
            align="center"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              👩‍🎓 รายชื่อนักเรียน
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingStudent(null);
                setVisible(true);
                form.resetFields();
              }}
            >
              เพิ่มนักเรียน
            </Button>
          </Space>

          <Table
            dataSource={filteredStudents}
            rowKey="id"
            loading={loading}
            bordered
            pagination={{ pageSize: 5 }}
            columns={[
              { title: "รหัสนักเรียน", dataIndex: "id", width: "10%" },
              {
                title: "ชื่อ - นามสกุล",
                render: (record) => (
                  <Space>
                    <UserOutlined style={{ color: "#1890ff" }} />
                    {record.firstName} {record.lastName}
                  </Space>
                ),
              },
              {
                title: "ระดับชั้น",
                dataIndex: "gradeLevelId",
                width: "10%",
                align: "center",
                render: (val) => <Tag color="blue">{val}</Tag>,
              },
              {
                title: "การจัดการ",
                width: "20%",
                render: (record) => (
                  <Space>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(record)}
                    >
                      แก้ไข
                    </Button>
                    <Popconfirm
                      title="ยืนยันการลบ?"
                      onConfirm={() => handleDelete(record.id)}
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        ลบ
                      </Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        </Card>

        {/* Modal Add/Edit */}
        <Modal
          open={visible}
          title={editingStudent ? "แก้ไขนักเรียน" : "เพิ่มนักเรียนใหม่"}
          okText="บันทึก"
          cancelText="ยกเลิก"
          onCancel={() => {
            setVisible(false);
            setEditingStudent(null);
            form.resetFields();
          }}
          onOk={() => form.submit()}
        >
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              name="prefixId"
              label="คำนำหน้า"
              rules={[{ required: true, message: "กรุณาเลือกคำนำหน้า" }]}
            >
              <Select placeholder="เลือกคำนำหน้า">
                {prefixes.map((p) => (
                  <Select.Option key={p.id} value={p.id}>
                    {p.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="firstName"
              label="ชื่อ"
              rules={[{ required: true, message: "กรุณากรอกชื่อ" }]}
            >
              <Input placeholder="กรอกชื่อนักเรียน" />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="นามสกุล"
              rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
            >
              <Input placeholder="กรอกนามสกุล" />
            </Form.Item>

            <Form.Item
              name="genderId"
              label="เพศ"
              rules={[{ required: true, message: "กรุณาเลือกเพศ" }]}
            >
              <Select placeholder="เลือกเพศ">
                {genders.map((g) => (
                  <Select.Option key={g.id} value={g.id}>
                    {g.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="birthDate"
              label="วันเกิด"
              rules={[{ required: true, message: "กรุณาเลือกวันเกิด" }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              name="gradeLevelId"
              label="ระดับชั้น (ตัวเลข)"
              rules={[
                { required: true, message: "กรุณากรอกระดับชั้น" },
                {
                  validator: (_, value) =>
                    value && value >= 1 && value <= 12
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("ระดับชั้นต้องอยู่ระหว่าง 1-12")
                        ),
                },
              ]}
            >
              <InputNumber
                min={1}
                max={12}
                style={{ width: "100%" }}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  if (!/^\d+$/.test(e.clipboardData.getData("text"))) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}
