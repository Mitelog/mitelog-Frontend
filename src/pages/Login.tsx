import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosAuth from "../api/axiosAuth";
import "../styles/login.css";

interface LoginResponse {
  status: number;
  msg: string;
  data: {
    accessToken: string;
    refreshToken: string;
    role: string;
    memberId: number; // ✅ 추가
  };
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axiosAuth.post<LoginResponse>("/auth", {
        email,
        password,
      });

      // ✅ 백엔드에서 감싸서 보내주는 구조
      const { accessToken, refreshToken, role, memberId } = res.data.data;

      // ✅ 토큰 및 사용자 정보 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role);
      localStorage.setItem("memberId", String(memberId)); // ✅ 문자열로 저장

      alert("ログイン成功！");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("로그인 실패:", err);
      setError("メールアドレスまたはパスワードが正しくありません。");
    }
  };

  return (
    <div className="login-container">
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="login-btn">
          ログイン
        </button>
      </form>
    </div>
  );
};

export default Login;
