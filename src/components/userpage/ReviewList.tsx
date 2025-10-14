import React from "react";
import "../../styles/userpage.css";

const dummyReviews = [
  {
    id: 1,
    restaurant: "すし一番",
    content: "とても美味しかったです！また行きたい！",
    date: "2025-09-20",
  },
  {
    id: 2,
    restaurant: "ラーメン花道",
    content: "スープが濃厚で最高！",
    date: "2025-08-10",
  },
];

const ReviewList: React.FC = () => {
  return (
    <div className="review-list">
      <h3>レビュー一覧</h3>
      {dummyReviews.map((review) => (
        <div key={review.id} className="review-card">
          <h4>{review.restaurant}</h4>
          <p>{review.content}</p>
          <small>{review.date}</small>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
