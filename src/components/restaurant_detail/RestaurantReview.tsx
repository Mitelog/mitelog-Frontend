import React, { useEffect, useState } from "react";
import axiosApi from "../../api/axiosApi";
import RestaurantReviewForm from "./RestaurantReviewForm";
import RestaurantReviewList from "./RestaurantReviewList";

interface Review {
  id: number;
  memberName: string;
  rating: number;
  content: string;
  createdAt: string;
}

interface Props {
  restaurantId: number;
}

const RestaurantReview: React.FC<Props> = ({ restaurantId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // ✨ 모달 상태

  /** ✅ 리뷰 목록 불러오기 */
  const fetchReviews = async () => {
    try {
      const res = await axiosApi.get(`/reviews/restaurant/${restaurantId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("리뷰 목록 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [restaurantId]);

  if (loading) return <p className="loading-text">レビューを読み込み中...</p>;

  /** ✅ 리뷰 등록 후 새로고침 */
  const handleReviewAdded = () => {
    fetchReviews();
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <div className="restaurant-review-section">
      {/* 상단 영역: 제목 + 버튼 */}
      <div className="review-header-row">
        <h3>レビュー</h3>
        <button
          className="write-review-btn"
          onClick={() => setIsModalOpen(true)}
        >
          レビューを投稿する
        </button>
      </div>

      {/* 리뷰 목록 */}
      <RestaurantReviewList reviews={reviews} />

      {/* ✨ 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // 부모 클릭 막기
          >
            <button
              className="modal-close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <RestaurantReviewForm
              restaurantId={restaurantId}
              onReviewAdded={handleReviewAdded}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantReview;
