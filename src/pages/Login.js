import { useState } from "react";
import axios from "axios"; // API 요청용
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 백엔드 로그인 API 호출 (URL은 실제 주소로 바꿔주세요)
      const res = await axios.post("http://52.78.21.91:8080/auth", {
        email,
        password,
      });

      // 응답 성공 처리 (예: 토큰 저장)
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      alert("로그인 성공!");
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
}

export default Login;
