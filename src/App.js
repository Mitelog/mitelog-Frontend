import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login"; // 방금 만든 Login 컴포넌트
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <main>
          <Routes>
            {/* 홈 화면 */}
            <Route
              path="/"
              element={
                <>
                  <h1>Hello React 🚀</h1>
                  <p>이건 CRA(App.js)에서 만든 메인 영역입니다.</p>
                </>
              }
            />

            {/* 로그인 화면 */}
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
