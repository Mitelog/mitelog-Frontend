import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosApi from "../api/axiosApi";
import "../styles/restaurantDetail.css";

// ✅ 백엔드에서 받아올 데이터 구조
interface RestaurantDetailData {
  id: number;
  name: string;
  address: string;
  description?: string;
  phone?: string;
  ownerId: number; // 가게 주인 ID
  ownerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL 파라미터 (예: /restaurants/5)
  const [restaurant, setRestaurant] = useState<RestaurantDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // ✅ 현재 로그인한 사용자 ID (JWT 기반, 나중에 실제 decode 로직 추가 가능)
  const loggedInUserId = localStorage.getItem("memberId"); // 로그인 시 저장한다고 가정

  // ✅ 식당 상세 조회 API
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

  const handleEditClick = () => {
    navigate(`/restaurants/edit/${restaurant?.id}`);
  };

  if (loading) return <p className="loading">読み込み中...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!restaurant) return <p>レストラン情報が見つかりません。</p>;

  const isOwner = loggedInUserId && Number(loggedInUserId) === restaurant.ownerId;

  return (
    <div className="restaurant-detail-container">
      <h2 className="detail-title">{restaurant.name}</h2>
      <p className="address">📍 {restaurant.address}</p>
      {restaurant.phone && <p className="phone">📞 {restaurant.phone}</p>}
      {restaurant.description && (
        <p className="description">{restaurant.description}</p>
      )}

      <div className="meta">
        <p>オーナー: {restaurant.ownerName || "非公開"}</p>
        <p>登録日: {restaurant.createdAt?.slice(0, 10)}</p>
      </div>

      {isOwner && (
        <button className="edit-btn" onClick={handleEditClick}>
          ✏️ 店舗情報を編集
        </button>
      )}
    </div>
  );
};

export default RestaurantDetail;
