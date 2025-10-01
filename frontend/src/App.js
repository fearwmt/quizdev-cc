import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from "react-router-dom";
import { Layout, Menu, Typography } from "antd";
import {
  TeamOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import StudentsPage from "./pages/StudentsPage";
import ClassroomsPage from "./pages/ClassroomsPage";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

// ✅ Component สำหรับเมนู navigation
function Navigation() {
  const location = useLocation();
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[location.pathname]}
      style={{ flex: 1, minWidth: 0 }}
    >
      <Menu.Item key="/students" icon={<TeamOutlined />}>
        <Link to="/students">นักเรียน</Link>
      </Menu.Item>
      <Menu.Item key="/classrooms" icon={<AppstoreOutlined />}>
        <Link to="/classrooms">ห้องเรียน</Link>
      </Menu.Item>
    </Menu>
  );
}

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        {/* ✅ Header */}
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            background: "#001529",
          }}
        >
          <Title level={3} style={{ color: "#fff", margin: "0 24px 0 0" }}>
            🎓 School Management
          </Title>
          <Navigation />
        </Header>

        {/* ✅ Content */}
        <Content style={{ margin: "24px", background: "#fff", padding: 24, borderRadius: 8 }}>
          <Routes>
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/classrooms" element={<ClassroomsPage />} />
            <Route path="/" element={<StudentsPage />} /> {/* default */}
          </Routes>
        </Content>

        {/* ✅ Footer */}
        <Footer style={{ textAlign: "center" }}>
          © {new Date().getFullYear()} School Management System | Powered by React & Ant Design
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
