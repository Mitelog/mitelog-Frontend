import React, { useEffect, useState } from "react";
import axiosApi from "../../api/axiosApi";
import "../restaurant_detail/restaurantReview.css";

interface Review {
  id: number;
  title: string;
  content: string;
  rating: number;
  restaurantName: string;
  createDateTime: string;
}

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  /** ✅ 내 리뷰 불러오기 */
  const fetchMyReviews = async () => {
    try {
      const res = await axiosApi.get(`/reviews/member/me`, {
        params: { page, size: 5 },
      });
      setReviews(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("❌ 내 리뷰 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, [page]);

  if (loading) return <p className="loading-text">レビューを読み込み中...</p>;

  return (
    <div className="review-list-container">
      <h3>내가 쓴 리뷰</h3>

      {reviews.length === 0 ? (
        <p>작성한 리뷰가 없습니다.</p>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="review-card">
            <div className="review-header">
              <h4>{r.restaurantName}</h4>
              <span className="rating">⭐ {r.rating}</span>
            </div>
            <p>{r.content}</p>
            <small>
              {new Date(r.createDateTime).toLocaleDateString("ko-KR")}
            </small>
          </div>
        ))
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>
            이전
          </button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
