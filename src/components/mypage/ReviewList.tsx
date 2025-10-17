import React, { useEffect, useState } from "react";
import axiosApi from "../../api/axiosApi";
import "../restaurant_detail/restaurantReview.css";

interface Review {
  id: number;
  restaurantName: string;
  title: string;
  rating: number;
  content: string;
  createdAt: string;
}

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ 페이징 관련 상태
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  /** ✅ 내 리뷰 목록 불러오기 */
  const fetchMyReviews = async (pageNum = 0) => {
    try {
      const res = await axiosApi.get(`/reviews/member/me`, {
        params: { page: pageNum, size: pageSize },
      });

      setReviews(res.data.content); // ✅ Page 객체 content
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("내 리뷰 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews(page);
  }, [page]);

  if (loading) return <p className="loading-text">レビューを読み込み中...</p>;

  return (
    <div className="restaurant-review-section">
      {/* 상단 영역 */}
      <div className="review-header-row">
        <h3>私のレビュー</h3>
      </div>

      {/* ✅ 리뷰 목록 */}
      {reviews.length === 0 ? (
        <p className="no-review-text">まだレビューがありません。</p>
      ) : (
        <div className="review-list">
          {reviews.map((r) => (
            <div className="review-card" key={r.id}>
              {/* 상단: 가게명 + 평점 */}
              <div className="review-header">
                <span className="review-restaurant">{r.restaurantName}</span>
                <span className="review-rating">⭐ {r.rating}</span>
              </div>

              {/* 제목 */}
              <h4 className="review-title">{r.title}</h4>

              {/* 본문 */}
              <p className="review-content">{r.content}</p>

              {/* 작성일 */}
              <p className="review-date">
                {new Date(r.createdAt).toLocaleDateString("ja-JP")}
              </p>
            </div>
          ))}
        </div>
      )}

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
    </div>
  );
};

export default ReviewList;
