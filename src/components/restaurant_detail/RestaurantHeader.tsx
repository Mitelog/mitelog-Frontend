import React, { useState } from "react";
import BookmarkButton from "./BookmarkButton";
import ReservationModal from "./ReservationModal";
import "./bookmarkButton.css";
import "../../styles/reservationModal.css"; // 모달 스타일
import "./restaurantHeader.css";

interface Props {
  restaurant: {
    id: number;
    name: string;
    averageRating?: number | null;
    categoryNames?: string[];
    imageUrl?: string;
  };
}

const RestaurantHeader: React.FC<Props> = ({ restaurant }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="restaurant-header">
      {/* ✅ 배너 이미지 */}
      <div className="banner">
        <div className="banner-overlay">
          <div className="banner-content">
            {/* 왼쪽: 식당명 / 카테고리 */}
            <div className="restaurant-left">
              <h2 className="restaurant-title">{restaurant.name}</h2>
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
