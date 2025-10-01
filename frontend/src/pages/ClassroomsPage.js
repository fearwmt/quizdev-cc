import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Popconfirm,
  message,
  Card,
  Typography,
  Alert,
  Layout,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import API from "../api/api";

const { Title } = Typography;
const { Header, Content } = Layout;

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState([]);
  const [filteredClassrooms, setFilteredClassrooms] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const [manageVisible, setManageVisible] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [students, setStudents] = useState([]); // นักเรียนทั้งหมด
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/classrooms");
      setClassrooms(res.data);
      setFilteredClassrooms(res.data);
    } catch {
      setAlert({ type: "error", message: "โหลดข้อมูลห้องเรียนไม่สำเร็จ" });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data);
    } catch {
      message.error("โหลดข้อมูลนักเรียนไม่สำเร็จ");
    }
  };

  useEffect(() => {
    fetchData();
    fetchStudents();
  }, []);

  const onFilter = (values) => {
    let data = [...classrooms];
    if (values.id) {
      data = data.filter((c) => String(c.id).includes(values.id));
    }
    if (values.homeroomTeacher) {
      data = data.filter((c) =>
        c.homeroomTeacher.includes(values.homeroomTeacher)
      );
    }
    if (values.academicYear) {
      data = data.filter((c) => c.academicYear === values.academicYear);
    }
    setFilteredClassrooms(data);
  };

  const onFinish = async (values) => {
    try {
      if (editing) {
        await API.put(`/classrooms/${editing.id}`, values);
        setAlert({ type: "success", message: "แก้ไขห้องเรียนสำเร็จ" });
      } else {
        await API.post("/classrooms", values);
        setAlert({ type: "success", message: "เพิ่มห้องเรียนสำเร็จ" });
      }
      fetchData();
      setVisible(false);
      form.resetFields();
      setEditing(null);
    } catch {
      setAlert({ type: "error", message: "เกิดข้อผิดพลาดในการบันทึก" });
    }
  };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/classrooms/${id}`);
      setAlert({ type: "success", message: "ลบห้องเรียนสำเร็จ" });
      fetchData();
    } catch {
      setAlert({ type: "error", message: "ลบห้องเรียนไม่สำเร็จ" });
    }
  };

  const handleManageStudents = (classroom) => {
    setSelectedClassroom(classroom);
    setManageVisible(true);
  };

  const addStudentToClassroom = async () => {
  if (!selectedStudentId) {
    message.warning("กรุณาเลือกนักเรียนก่อน");
    return;
  }
  try {
    await API.post(
      `/classrooms/${selectedClassroom.id}/students/${selectedStudentId}`
    );
    message.success("เพิ่มนักเรียนเข้าห้องสำเร็จ");
    setAlert({ type: "success", message: "เพิ่มนักเรียนเข้าห้องสำเร็จ" });

    const updated = await API.get(`/classrooms/${selectedClassroom.id}`);
    setSelectedClassroom(updated.data);

    fetchData(); 
    setSelectedStudentId(null);
  } catch {
    message.error("เพิ่มนักเรียนไม่สำเร็จ");
    setAlert({ type: "error", message: "เพิ่มนักเรียนไม่สำเร็จ" });
  }
};

   const removeStudentFromClassroom = async (studentId) => {
  try {
    await API.delete(
      `/classrooms/${selectedClassroom.id}/students/${studentId}`
    );
    message.success("ลบนักเรียนออกจากห้องสำเร็จ");
    setAlert({ type: "success", message: "ลบนักเรียนออกจากห้องสำเร็จ" });

    const updated = await API.get(`/classrooms/${selectedClassroom.id}`);
    setSelectedClassroom(updated.data);

    fetchData(); 
  } catch {
    message.error("ลบนักเรียนไม่สำเร็จ");
    setAlert({ type: "error", message: "ลบนักเรียนไม่สำเร็จ" });
  }
};

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Header style={{ background: "#fff", padding: "0 24px", marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          🏫 Classroom Management
        </Title>
      </Header>

      <Content style={{ margin: "0 24px" }}>
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

        <Card
          bordered={false}
          style={{
            marginBottom: 20,
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          {/* ฟอร์มค้นหา */}
          <Form
            form={filterForm}
            layout="inline"
            onFinish={onFilter}
            style={{ marginBottom: 16 }}
          >
            <Form.Item name="id" label="เลขห้อง">
              <Input placeholder="ค้นหาเลขห้อง" allowClear />
            </Form.Item>
            <Form.Item name="homeroomTeacher" label="ครูประจำชั้น">
              <Input placeholder="ค้นหาชื่อครู" allowClear />
            </Form.Item>
            <Form.Item name="academicYear" label="ปีการศึกษา">
              <InputNumber min={1901} max={2155} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                ค้นหา
              </Button>
            </Form.Item>
          </Form>

          <Space
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              📝 รายการห้องเรียน
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditing(null);
                form.resetFields();
                setVisible(true);
              }}
            >
              เพิ่มห้องเรียน
            </Button>
          </Space>

          {/* ตารางห้องเรียน */}
          <Table
            dataSource={filteredClassrooms}
            rowKey="id"
            loading={loading}
            bordered
            pagination={{ pageSize: 5 }}
            columns={[
              { title: "รหัสห้อง", dataIndex: "id", width: "10%", align: "center" },
              {
                title: "ปีการศึกษา",
                dataIndex: "academicYear",
                width: "15%",
                align: "center",
              },
              { title: "ครูประจำชั้น", dataIndex: "homeroomTeacher", width: "25%" },
              {
                title: "จำนวนนักเรียน",
                render: (record) => record.students?.length || 0,
                width: "15%",
                align: "center",
              },
              {
                title: "การจัดการ",
                width: "25%",
                align: "center",
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
                    <Button
                      type="dashed"
                      icon={<UserAddOutlined />}
                      onClick={() => handleManageStudents(record)}
                    >
                      นักเรียน
                    </Button>
                  </Space>
                ),
              },
            ]}
          />
        </Card>

        {/* Modal ห้องเรียน */}
        <Modal
          open={visible}
          title={editing ? "แก้ไขห้องเรียน" : "เพิ่มห้องเรียน"}
          okText="บันทึก"
          cancelText="ยกเลิก"
          onCancel={() => {
            setVisible(false);
            setEditing(null);
            form.resetFields();
          }}
          onOk={() => form.submit()}
        >
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              name="academicYear"
              label="ปีการศึกษา"
              rules={[
                { required: true, message: "กรุณากรอกปีการศึกษา" },
                {
                  validator: (_, value) =>
                    value && value >= 1901 && value <= 2155
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("ปีการศึกษาต้องอยู่ระหว่าง 1901 - 2155")
                        ),
                },
              ]}
            >
              <InputNumber min={1901} max={2155} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="homeroomTeacher"
              label="ครูประจำชั้น"
              rules={[{ required: true, message: "กรุณากรอกชื่อครู" }]}
            >
              <Input placeholder="เช่น ครูสมชาย" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal จัดการนักเรียนในห้อง */}
        <Modal
          open={manageVisible}
          title={`จัดการนักเรียนในห้อง ${selectedClassroom?.id || ""}`}
          okText="ปิด"
          cancelText="ยกเลิก"
          onCancel={() => setManageVisible(false)}
          onOk={() => setManageVisible(false)}
          width={700}
        >
          {/* เลือกนักเรียนใหม่ */}
          <Space style={{ marginBottom: 16 }}>
            <Select
              style={{ width: 300 }}
              placeholder="เลือกนักเรียน"
              value={selectedStudentId}
              onChange={(value) => setSelectedStudentId(value)}
            >
              {students.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName}
                </Select.Option>
              ))}
            </Select>
            <Button type="primary" onClick={addStudentToClassroom}>
              เพิ่มนักเรียนเข้าห้อง
            </Button>
          </Space>

          {/* ตารางนักเรียนในห้อง */}
          <Table
            dataSource={selectedClassroom?.students || []}
            rowKey="id"
            bordered
            pagination={false}
            columns={[
              { title: "รหัสนักเรียน", dataIndex: "id", width: "20%" },
              {
                title: "ชื่อ-นามสกุล",
                render: (record) => `${record.firstName} ${record.lastName}`,
              },
              {
                title: "การจัดการ",
                width: "20%",
                render: (record) => (
                  <Popconfirm
                    title="ยืนยันการนำออก?"
                    onConfirm={() => removeStudentFromClassroom(record.id)}
                  >
                    <Button danger size="small">
                      นำออก
                    </Button>
                  </Popconfirm>
                ),
              },
            ]}
          />
        </Modal>
      </Content>
    </Layout>
  );
}
