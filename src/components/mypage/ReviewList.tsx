import React, { useEffect, useState } from "react";
import axiosApi from "../../api/axiosApi";
import "../../styles/reviewList.css";

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

  // ✅ 페이징 상태
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  /** ✅ 내 리뷰 목록 불러오기 */
  const fetchMyReviews = async (pageNum = 0) => {
    try {
      const res = await axiosApi.get("/reviews/member/me", {
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
    <div className="review-list-container">
      <h3 className="review-section-title">私のレビュー</h3>

      {reviews.length === 0 ? (
        <p className="no-review-text">まだレビューがありません。</p>
      ) : (
        <ul className="review-list">
          {reviews.map((review) => (
            <li key={review.id} className="review-card">
              <h4 className="review-title">{review.title}</h4>
              <p className="review-restaurant">
                店舗名: <strong>{review.restaurantName}</strong>
              </p>
              <p className="review-rating">評価: {review.rating} / 5</p>
              <p className="review-content">{review.content}</p>
              <span className="review-date">
                投稿日時: {new Date(review.createdAt).toLocaleDateString("ja-JP")}
              </span>
            </li>
          ))}
        </ul>
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
