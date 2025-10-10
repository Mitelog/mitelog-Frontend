import React from "react";
import "../styles/header.css";

const Header: React.FC = () => {
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
            <li><a href="/restaurants">レストラン</a></li>
            <li><a href="/ranking">ランキング</a></li>
            <li><a href="/review">口コミ</a></li>
            <li><a href="/map">地図</a></li>
          </ul>
        </nav>

        <div className="header-utils">
          <a href="/login" className="login-link">ログイン</a>
          <a href="/signup" className="signup-link">新規会員登録</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
