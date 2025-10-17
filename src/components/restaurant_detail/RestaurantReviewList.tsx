import React from "react";

interface Review {
  id: number;
  memberName: string;
  title: string;
  rating: number;
  content: string;
  createdAt: string;
}

interface Props {
  reviews: Review[];
}

const RestaurantReviewList: React.FC<Props> = ({ reviews }) => {
  if (reviews.length === 0)
    return <p className="no-review-text">まだレビューがありません。</p>;

  return (
    <div className="review-list">
      {reviews.map((r) => (
        <div className="review-card" key={r.id}>
          {/* 상단: 작성자 + 평점 */}
          <div className="review-header">
            <span className="review-author">{r.memberName}</span>
            <span className="review-rating">⭐ {r.rating}</span>
          </div>

          {/* ✅ 제목 */}
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
  );
};

export default RestaurantReviewList;
