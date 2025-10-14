import React from "react";

interface Props {
  restaurantId: number;
}

const RestaurantReview: React.FC<Props> = () => {
  return (
    <div className="restaurant-review">
      <p>レビュー機能は現在準備中です。</p>
    </div>
  );
};

export default RestaurantReview;
