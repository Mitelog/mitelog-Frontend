import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axiosApi from "../api/axiosApi";
import "../styles/restaurantDetail.css";

import RestaurantHeader from "../components/restaurant_detail/RestaurantHeader";
import RestaurantTabs from "../components/restaurant_detail/RestaurantTabs";
import RestaurantContent from "../components/restaurant_detail/RestaurantContent";

// ✅ JWT Payload 타입 정의
interface JwtPayload {
  memberId: number;
  sub?: string;
  exp?: number;
}

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
  averageRating?: number;
  reviewCount?: number;
  categoryNames?: string[];
  imageUrl?: string;
}

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // ✅ URL 파라미터에서 식당 ID 가져오기
  const [restaurant, setRestaurant] = useState<RestaurantDetailData | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"main" | "menu" | "review">(
    "main"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  /* ✅ 1. JWT decode로 로그인한 사용자 정보 확인 */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.memberId) {
          setLoggedInUserId(decoded.memberId);
        } else {
          console.warn("⚠️ memberId가 JWT에 포함되어 있지 않습니다.");
        }
      } catch (err) {
        console.error("JWT 디코드 실패:", err);
        setLoggedInUserId(null);
      }
    } else {
      console.log("로그인되지 않은 사용자입니다.");
      setLoggedInUserId(null);
    }
  }, []);

  /* ✅ 2. 식당 상세 정보 조회 */
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

  /* ✅ 3. 로딩 / 에러 / 데이터 없는 경우 처리 */
  if (loading) return <p className="loading-text">読み込み中...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!restaurant) return <p>レストラン情報が見つかりません。</p>;

  /* ✅ 4. 현재 로그인 유저가 사장인지 판별 */
  const isOwner =
    loggedInUserId !== null && loggedInUserId === restaurant.ownerId;

  /* ✅ 5. 수정 버튼 클릭 시 편집 페이지로 이동 */
  const handleEditClick = () => {
    navigate(`/restaurants/edit/${restaurant.id}`);
  };

  /* ✅ 6. 렌더링 */
  return (
    <div className="restaurant-container">
      {/* 상단 헤더 영역 */}
      <RestaurantHeader restaurant={restaurant} />

      {/* 탭 영역 */}
      <RestaurantTabs
        restaurant={restaurant}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 탭별 콘텐츠 */}
      <RestaurantContent restaurant={restaurant} activeTab={activeTab} />

      {/* ✅ 사장 본인일 때만 수정 버튼 표시 */}
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
