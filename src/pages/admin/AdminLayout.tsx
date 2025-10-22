import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { ChakraProvider } from "@chakra-ui/react"; // ✅ 여기에만 import
import "../../styles/admin.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    if (!token || role !== "ADMIN") {
      alert("관리자만 접근할 수 있습니다.");
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChakraProvider>
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </ChakraProvider>
  );
}
