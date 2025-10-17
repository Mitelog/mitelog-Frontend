import React, { useEffect, useState } from "react";
import axiosApi from "../../api/axiosApi";
import RestaurantReviewForm from "./RestaurantReviewForm";
import RestaurantReviewList from "./RestaurantReviewList";
import "./restaurantReview.css";

interface Review {
  id: number;
  memberName: string;
  title: string; // ✅ 제목 추가
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ 페이징 관련 상태
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  /** ✅ 리뷰 목록 불러오기 */
  const fetchReviews = async (pageNum = 0) => {
    try {
      const res = await axiosApi.get(`/reviews/restaurant/${restaurantId}`, {
        params: { page: pageNum, size: pageSize },
      });

      setReviews(res.data.content); // ✅ Page 객체 content
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("리뷰 목록 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [restaurantId, page]);

  if (loading) return <p className="loading-text">レビューを読み込み中...</p>;

  /** ✅ 리뷰 등록 후 새로고침 */
  const handleReviewAdded = () => {
    fetchReviews(0); // 새 리뷰 작성 시 첫 페이지로 리셋
    setPage(0);
    setIsModalOpen(false);
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

      {/* ✅ 리뷰 목록 */}
      <RestaurantReviewList reviews={reviews} />

      {/* ✅ 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
            className="page-btn"
          >
            ◀ 前へ
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx)}
              className={`page-btn ${page === idx ? "active" : ""}`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
            className="page-btn"
          >
            次へ ▶
          </button>
        </div>
      )}

      {/* ✅ 모달 */}
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
