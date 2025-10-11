import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/header.css";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 토큰 여부 감지 (페이지 이동 시마다 갱신)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  // ✅ 로그아웃 처리
  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    alert("ログアウトしました。");
    navigate("/"); // ✅ 메인 페이지로 이동
  };

  return (
    <header id="header" className="global-header">
      <div className="header-inner">
        <div className="header-logo">
          <a href="/">
            <img src="/logo192.png" alt="食べログ" />
          </a>
        </div>

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
            <li>
              <a href="/map">地図</a>
            </li>
          </ul>
        </nav>

        <div className="header-utils">
          {isLoggedIn ? (
            // ✅ 로그인 상태 → 로그아웃 버튼만 표시
            <a href="/logout" className="login-link" onClick={handleLogout}>
              ログアウト
            </a>
          ) : (
            // ✅ 로그아웃 상태 → 로그인 / 회원가입 표시
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
