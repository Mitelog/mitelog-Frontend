import React from "react";
import "../../styles/admin-header.css";

const AdminHeader: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("memberId");
    alert("관리자 로그아웃 완료");
    window.location.href = "/";
  };

  const handleGoMain = () => {
    window.location.href = "/"; // ✅ 메인페이지로 이동
  };

  return (
    <header className="admin-header">
      <h1 className="admin-header-title">관리자 페이지</h1>

      <div className="admin-header-utils">
        {/* ✅ 메인 페이지로 돌아가기 */}
        <button className="admin-home" onClick={handleGoMain}>
          메인으로
        </button>

        {/* ✅ 로그아웃 */}
        <button className="admin-logout" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
