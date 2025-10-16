import React from "react";

interface Review {
  id: number;
  memberName: string;
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
        <div key={r.id} className="review-item">
          <div className="review-header">
            <span className="review-author">{r.memberName}</span>
            <span className="review-rating">⭐ {r.rating}</span>
          </div>
          <p className="review-content">{r.content}</p>
          <span className="review-date">
            {new Date(r.createdAt).toLocaleDateString("ja-JP")}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RestaurantReviewList;
