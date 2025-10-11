// src/pages/RestaurantList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../api/axiosApi";
import "../styles/restaurantList.css";

interface Restaurant {
  id: number;
  name: string;
  address: string;
  ownerName?: string;
}

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // ✅ 로그인 상태 체크
  const isLoggedIn = !!localStorage.getItem("accessToken");

  useEffect(() => {
  const fetchRestaurants = async () => {
    try {
      const res = await axiosApi.get("/restaurants");

      // ✅ 응답 구조 확인 후 올바른 데이터만 설정
      const restaurantList = Array.isArray(res.data)
        ? res.data
        : res.data.data;

      setRestaurants(restaurantList || []);
    } catch (err) {
      console.error("식당 목록 조회 실패:", err);
      setError("データの取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };
  fetchRestaurants();
}, []);


  if (loading) return <p className="loading">読み込み中...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="restaurant-list-container">
      <h2 className="page-title">レストラン一覧</h2>

      {/* ✅ 로그인한 사용자에게만 등록 버튼 표시 */}
      {isLoggedIn && (
        <button
          className="register-btn"
          onClick={() => navigate("/restaurants/new")}
        >
          ➕ 新しいレストランを登録
        </button>
      )}

      {restaurants.length === 0 ? (
        <p>登録されたレストランがありません。</p>
      ) : (
        <ul className="restaurant-list">
          {restaurants.map((r) => (
            <li
              key={r.id}
              className="restaurant-item"
              onClick={() => navigate(`/restaurants/${r.id}`)}
            >
              <h3>{r.name}</h3>
              <p>{r.address}</p>
              {r.ownerName && <p className="owner">オーナー: {r.ownerName}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RestaurantList;
