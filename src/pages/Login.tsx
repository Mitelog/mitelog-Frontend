import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import "../styles/login.css";

// ✅ 백엔드 응답 타입 정의
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// ✅ 컴포넌트
const Login: React.FC = () => {
  // 상태값 타입 명시
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  // 이벤트 핸들러 타입 지정
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res: AxiosResponse<LoginResponse> = await axios.post(
        "http://52.78.21.91:8080/auth",
        { email, password }
      );

      // 응답 성공 처리
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      alert("ログイン成功！");
      console.log("로그인 성공:", res.data);
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            placeholder="example@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
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
