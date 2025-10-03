import { useState } from "react";
import axios from "axios";
import "../styles/signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 백엔드 회원가입 API 호출
      await axios.post("http://52.78.21.91:8080/api/members/register", {
        email,
        password,
        name,
        phone,
      });

      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      window.location.href = "/login"; // 회원가입 후 로그인 페이지로 이동
    } catch (err) {
      console.error("회원가입 실패:", err);
      setError("회원가입に失敗しました。もう一度お試しください。");
    }
  };

  return (
    <div className="signup-container">
      <h2>新規登録</h2>

      <form onSubmit={handleSubmit} className="signup-form">
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

        <div className="form-group">
          <label>名前</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="山田太郎"
            required
          />
        </div>

        <div className="form-group">
          <label>電話番号</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-1234-5678"
          />
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="signup-btn">
          新規登録
        </button>
      </form>
    </div>
  );
}

export default Signup;
