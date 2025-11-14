import React, { useEffect, useState } from "react";
import "/src/styles/restaurantReview.css";

interface Review {
  id: number;
  restaurantName: string;
  title: string;
  rating: number;
  content: string;
  createdAt: string;
}

const UserReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    setLoading(true);

    // ✅ 더미 리뷰 데이터
    const dummy = [
      {
        id: 1,
        restaurantName: "스시다루",
        title: "신선한 초밥 맛집!",
        rating: 5,
        content: "회가 두껍고 밥이 적당해서 일본 느낌 나요 🍣",
        createdAt: "2025-10-01",
      },
      {
        id: 2,
        restaurantName: "미테로그 포차",
        title: "분위기 최고",
        rating: 4,
        content: "조명 예쁘고 서비스 좋아요. 친구랑 다시 갈 듯!",
        createdAt: "2025-09-21",
      },
      {
        id: 3,
        restaurantName: "카레짱",
        title: "매운 카레가 일품",
        rating: 5,
        content: "적당히 매워서 밥이 계속 들어가요 🍛",
        createdAt: "2025-09-10",
      },
    ];

    setTimeout(() => {
      setReviews(dummy);
      setTotalPages(Math.ceil(dummy.length / pageSize));
      setLoading(false);
    }, 300);
  }, [page]);

  if (loading) return <p className="loading-text">レビューを読み込み中...</p>;

  return (
    <div className="restaurant-review-section">
      <div className="review-header-row">
        <h3>ユーザーレビュー</h3>
      </div>

      {reviews.length === 0 ? (
        <p className="no-review-text">まだレビューがありません。</p>
      ) : (
        <div className="review-list">
          {reviews.map((r) => (
            <div className="review-card" key={r.id}>
              <div className="review-header">
                <span className="review-restaurant">{r.restaurantName}</span>
                <span className="review-rating">⭐ {r.rating}</span>
              </div>
              <h4 className="review-title">{r.title}</h4>
              <p className="review-content">{r.content}</p>
              <p className="review-date">
                {new Date(r.createdAt).toLocaleDateString("ja-JP")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviews;
