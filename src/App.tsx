import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Mypage from "./pages/Mypage";
import RestaurantList from "./pages/RestaurantList"; // ✅ 추가
import RestaurantDetail from "./pages/RestaurantDetail"; // ✅ 추가 
import RestaurantForm from "./pages/RestaurantForm"; // ✅ 추가 
import "./App.css";

const App: React.FC = () => {
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
                  <p>이건 CRA(App.tsx)에서 만든 메인 영역입니다.</p>
                </>
              }
            />

            {/* 로그인 화면 */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/mypage" element={<Mypage />} />

            {/* ✅ 레스토랑 관련 페이지 */}
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/restaurants/new" element={<RestaurantForm />} />
            <Route path="/restaurants/edit/:id" element={<RestaurantForm />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
