import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosApi from "../api/axiosApi";
import "../styles/restaurantDetail.css";

import RestaurantHeader from "../components/restaurant_detail/RestaurantHeader";
import RestaurantTabs from "../components/restaurant_detail/RestaurantTabs";
import RestaurantContent from "../components/restaurant_detail/RestaurantContent";

// ✅ 백엔드에서 받아올 데이터 구조 정의
interface RestaurantDetailData {
  id: number;
  name: string;
  address: string;
  description?: string;
  phone?: string;
  ownerId: number;
  ownerName?: string;
  createdAt?: string;
  updatedAt?: string;
  rating?: number;
  reviewCount?: number;
  categoryNames?: string[];
  imageUrl?: string;
}

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL 파라미터
  const [restaurant, setRestaurant] = useState<RestaurantDetailData | null>(null);
  const [activeTab, setActiveTab] = useState<"main" | "menu" | "review">("main");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // ✅ 로그인한 사용자 ID (JWT decode로 교체 예정)
  const loggedInUserId = localStorage.getItem("memberId");

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axiosApi.get(`/restaurants/${id}`);
        setRestaurant(res.data);
      } catch (err) {
        console.error("식당 상세 조회 실패:", err);
        setError("詳細情報の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  if (loading) return <p className="loading-text">読み込み中...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!restaurant) return <p>レストラン情報が見つかりません。</p>;

  const isOwner = loggedInUserId && Number(loggedInUserId) === restaurant.ownerId;

  const handleEditClick = () => {
    navigate(`/restaurants/edit/${restaurant.id}`);
  };

  return (
    <div className="restaurant-container">
      <RestaurantHeader restaurant={restaurant} />
      <RestaurantTabs
        restaurant={restaurant}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <RestaurantContent restaurant={restaurant} activeTab={activeTab} />

      {isOwner && (
        <div className="edit-section">
          <button className="edit-btn" onClick={handleEditClick}>
            ✏️ 店舗情報を編集
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
