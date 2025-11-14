import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminHeader from "./components/admin/AdminHeader";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Mypage from "./pages/mypage/Mypage";
import RestaurantList from "./pages/restaurant/RestaurantList";
import RestaurantDetail from "./pages/restaurant/RestaurantDetail";
import RestaurantForm from "./pages/restaurant/RestaurantForm";
import MainPage from "./pages/MainPage";
import UserPage from "./pages/user/UserPage";
import "./App.css";

/* ✅ Lazy load로 관리자 관련 모듈만 분리 */
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminMembers = lazy(() => import("./pages/admin/AdminMembers"));
const AdminRestaurants = lazy(() => import("./pages/admin/AdminRestaurants"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminMemberEdit = lazy(() => import("./pages/admin/AdminMemberEdit"));
const AdminRestaurantEdit = lazy(
  () => import("./pages/admin/AdminRestaurantEdit")
);
const AdminReviewEdit = lazy(() => import("./pages/admin/AdminReviewEdit"));

/* ✅ 페이지 전환 감지용 */
const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="App">
      {/* ✅ 관리자 전용 헤더 / 일반 헤더 구분 */}
      {isAdminPage ? <AdminHeader /> : <Header />}

      <main>
        <Suspense fallback={<p>Loading...</p>}>
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

            {/* ✅ 관리자 페이지 (Lazy load로 Chakra 전용 구역) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="members" element={<AdminMembers />} />
              <Route path="restaurants" element={<AdminRestaurants />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="members/:id/edit" element={<AdminMemberEdit />} />
              <Route
                path="restaurants/:id/edit"
                element={<AdminRestaurantEdit />}
              />
              <Route path="reviews/:id/edit" element={<AdminReviewEdit />} />
            </Route>

            {/* 레스토랑 관련 */}
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/restaurants/new" element={<RestaurantForm />} />
            <Route path="/restaurants/edit/:id" element={<RestaurantForm />} />
          </Routes>
        </Suspense>
      </main>

      {/* ✅ Footer도 관리자 페이지에서는 숨김 */}
      {!isAdminPage && <Footer />}
    </div>
  );
};

/* ✅ 라우터 감싸기 */
const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
