import React from "react";

interface Props {
  restaurantId: number;
}

const RestaurantReview: React.FC<Props> = ({ restaurantId }) => {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <p>レビュー機能は現在準備中です 🍣</p>
    </div>
  );
};

export default RestaurantReview;
