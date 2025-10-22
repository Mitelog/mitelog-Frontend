import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminHeader from "./components/admin/AdminHeader";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Mypage from "./pages/Mypage";
import RestaurantList from "./pages/RestaurantList";
import RestaurantDetail from "./pages/RestaurantDetail";
import RestaurantForm from "./pages/RestaurantForm";
import MainPage from "./pages/MainPage";
import UserPage from "./pages/UserPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminRestaurants from "./pages/admin/AdminRestaurants";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminMemberEdit from "./pages/admin/AdminMemberEdit";
import AdminRestaurantEdit from "./pages/admin/AdminRestaurantEdit";
import AdminReviewEdit from "./pages/admin/AdminReviewEdit";
import "./App.css";

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="App">
      {/* ✅ 관리자 페이지가 아닐 때만 기존 헤더 표시 */}
      {isAdminPage ? <AdminHeader /> : <Header />}

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
          <Route path="/users/:id" element={<UserPage />} />

          {/* ✅ 관리자 페이지 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="restaurants" element={<AdminRestaurants />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="members/:id/edit" element={<AdminMemberEdit />} />
            <Route path="restaurants/:id/edit" element={<AdminRestaurantEdit />} />
            <Route path="reviews/:id/edit" element={<AdminReviewEdit />} />
          </Route>

          {/* 레스토랑 관련 */}
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/restaurants/new" element={<RestaurantForm />} />
          <Route path="/restaurants/edit/:id" element={<RestaurantForm />} />
        </Routes>
      </main>

      {/* ✅ Footer도 관리자 페이지에서는 숨길 수 있음 */}
      {!isAdminPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
