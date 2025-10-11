import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosAuth from "../api/axiosAuth"; // ✅ 공용 axios 사용
import "../styles/login.css";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
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

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

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
