import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookmarkButton from "./BookmarkButton";
import ReservationModal from "./ReservationModal";
import "./bookmarkButton.css";
import "../../styles/reservationModal.css"; // 모달 스타일
import "../../styles/restaurantHeader.css";

interface Props {
  restaurant: {
    id: number;
    name: string;
    averageRating?: number | null;
    categoryNames?: string[];
    imageUrl?: string;

    // ✅ 가게 주인 정보
    ownerId?: number;
    ownerEmail?: string;
  };
}

const RestaurantHeader: React.FC<Props> = ({ restaurant }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ 주인 이름 클릭 시 유저페이지로 이동
  const handleOwnerClick = () => {
    if (restaurant.ownerId) {
      navigate(`/users/${restaurant.ownerId}`); // ✅ 수정된 경로
    }
  };

  return (
    <div className="restaurant-header">
      {/* ✅ 배너 이미지 */}
      <div
        className="banner"
        style={{
          backgroundImage: `url(${
            restaurant.imageUrl || "/default-restaurant.jpg"
          })`,
        }}
      >
        <div className="banner-overlay">
          <div className="banner-content">
            {/* 왼쪽: 식당명 / 주인 / 카테고리 */}
            <div className="restaurant-left">
              <h2 className="restaurant-title">{restaurant.name}</h2>

              {/* ✅ 가게 주인 이름 (클릭 시 이동) */}
              {restaurant.ownerEmail && (
                <p
                  className="restaurant-owner"
                  onClick={handleOwnerClick}
                  style={{
                    cursor: "pointer",
                    color: "#ff6600", // 프로젝트 포인트 컬러
                    fontWeight: 500,
                    margin: "4px 0",
                  }}
                >
                  👨‍🍳 店主: {restaurant.ownerEmail}
                </p>
              )}

              {restaurant.categoryNames?.length ? (
                <p className="restaurant-subtitle">
                  {restaurant.categoryNames.join(" / ")}
                </p>
              ) : null}
            </div>

            {/* 오른쪽: 평점 + 북마크 + 예약 */}
            <div className="restaurant-actions">
              {typeof restaurant.averageRating === "number" && (
                <div className="restaurant-rating">
                  ⭐ {restaurant.averageRating.toFixed(1)}
                </div>
              )}
              <div className="action-buttons">
                <BookmarkButton restaurantId={restaurant.id} />
                <button
                  className="reserve-btn"
                  onClick={() => setIsModalOpen(true)}
                >
                  예약하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 예약 모달 */}
      {isModalOpen && (
        <ReservationModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default RestaurantHeader;
