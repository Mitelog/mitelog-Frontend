// src/components/admin/Topbar.tsx
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      navigate("/"); // 홈으로 이동
    }
  };

  return (
    <header className="topbar">
      <h1>관리자 페이지</h1>
      <div className="topbar-right">
        <button onClick={handleLogout}>로그아웃</button>
      </div>
    </header>
  );
}
