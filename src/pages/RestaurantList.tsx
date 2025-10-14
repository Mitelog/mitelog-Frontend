import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../api/axiosApi";
import FilterSidebar from "../components/sidebar/FilterSidebar";
import "../styles/restaurantList.css";

interface Restaurant {
  id: number;
  name: string;
  address: string;
  ownerName?: string;
  category?: string;
}

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filters, setFilters] = useState({
    keyword: "",
    region: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("accessToken");

  // ✅ filters 변경 시마다 API 재호출
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const res = await axiosApi.get("/restaurants", { params: filters });
        setRestaurants(res.data.content || []);
      } catch (err) {
        console.error("식당 목록 조회 실패:", err);
        setError("データの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [filters]);

  if (loading) return <p className="loading">読み込み中...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="restaurant-page">
      {/* 왼쪽 필터 */}
      <FilterSidebar onFilterChange={setFilters} />

      {/* 오른쪽 메인 */}
      <main className="restaurant-main">
        <div className="list-header">
          <h2 className="page-title">レストラン一覧</h2>
          {isLoggedIn && (
            <button
              className="register-btn"
              onClick={() => navigate("/restaurants/new")}
            >
              ➕ 新しいレストランを登録
            </button>
          )}
        </div>

        {restaurants.length === 0 ? (
          <p>該当するレストランが見つかりません。</p>
        ) : (
          <ul className="restaurant-list">
            {restaurants.map((r) => (
              <li
                key={r.id}
                className="restaurant-card"
                onClick={() => navigate(`/restaurants/${r.id}`)}
              >
                <div className="restaurant-info">
                  <h3 className="restaurant-name">{r.name}</h3>
                  <p className="restaurant-address">{r.address}</p>
                  {r.category && (
                    <p className="restaurant-category">
                      カテゴリ: {r.category}
                    </p>
                  )}
                  {r.ownerName && (
                    <p className="restaurant-owner">オーナー: {r.ownerName}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default RestaurantList;
