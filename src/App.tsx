import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Mypage from "./pages/Mypage";
import RestaurantList from "./pages/RestaurantList";
import RestaurantDetail from "./pages/RestaurantDetail";
import RestaurantForm from "./pages/RestaurantForm";
import MainPage from "./pages/MainPage";
import UserPage from "./pages/UserPage"; // ✅ 추가
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Header />

        <main>
          <Routes>
            {/* 홈 화면 */}
            <Route path="/" element={<MainPage />} />

            {/* 로그인 / 회원가입 */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 마이페이지 */}
            <Route path="/mypage" element={<Mypage />} />

            {/* ✅ 다른 유저 페이지 */}
            <Route path="/users/:id" element={<UserPage />} /> {/* ✅ 추가 */}

            {/* 레스토랑 관련 */}
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
