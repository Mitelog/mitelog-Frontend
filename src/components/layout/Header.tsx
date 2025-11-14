import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "/src/styles/header.css";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null); // ✅ 사용자 권한 상태
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 페이지 이동 시마다 로그인 상태와 role 갱신
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    const memberId = localStorage.getItem("memberId");

    console.log("🧩 [Header] accessToken:", token);
    console.log("🧩 [Header] role:", role);
    console.log("🧩 [Header] memberId:", memberId);

    setIsLoggedIn(!!token);
    setUserRole(role);
  }, [location.pathname]);

  // ✅ 로그아웃 처리
  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("memberId");
    localStorage.removeItem("role");
    alert("ログアウトしました。");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  return (
    <header id="header" className="global-header">
      <div className="header-inner">
        {/* 로고 영역 */}
        <div className="header-logo">
          <a href="/">
            <img src="/images/mitelog-logo.png" alt="ミテログ" />
          </a>
        </div>

        {/* 내비게이션 */}
        <nav className="global-nav">
          <ul>
            <li>
              <a href="/restaurants">レストラン</a>
            </li>
            <li>
              <a href="/ranking">ランキング</a>
            </li>
            <li>
              <a href="/review">口コミ</a>
            </li>

            {/* ✅ 관리자 전용 메뉴 */}
            {userRole === "ADMIN" && (
              <li>
                <a href="/admin">管理者ページ</a>
              </li>
            )}
          </ul>
        </nav>

        {/* 로그인 / 로그아웃 / 회원가입 / 마이페이지 */}
        <div className="header-utils">
          {isLoggedIn ? (
            <>
              <a href="/logout" className="login-link" onClick={handleLogout}>
                ログアウト
              </a>
              <a href="/mypage" className="mypage-link">
                マイページ
              </a>
            </>
          ) : (
            <>
              <a href="/login" className="login-link">
                ログイン
              </a>
              <a href="/signup" className="signup-link">
                新規会員登録
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
