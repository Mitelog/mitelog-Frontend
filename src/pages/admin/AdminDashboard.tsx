// src/pages/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import {
  getAllMembers,
  getAllRestaurants,
  getAllReviews,
} from "../../api/axiosAdmin";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    members: 0,
    restaurants: 0,
    reviews: 0,
  });

  const loadStats = async () => {
    const [m, r, rv] = await Promise.all([
      getAllMembers(),
      getAllRestaurants(),
      getAllReviews(),
    ]);
    setStats({
      members: m.data.data.totalElements,
      restaurants: r.data.data.totalElements,
      reviews: rv.data.data.totalElements,
    });
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div>
      <h2>대시보드</h2>
      <div className="dashboard-cards">
        <div className="card">
          <h3>회원 수</h3>
          <p>{stats.members}명</p>
        </div>
        <div className="card">
          <h3>식당 수</h3>
          <p>{stats.restaurants}개</p>
        </div>
        <div className="card">
          <h3>리뷰 수</h3>
          <p>{stats.reviews}개</p>
        </div>
      </div>
    </div>
  );
}
