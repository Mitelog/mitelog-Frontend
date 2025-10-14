import React from "react";

interface Props {
  restaurantId: number;
}

const RestaurantMenu: React.FC<Props> = ({ restaurantId }) => {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <p>メニュー情報は現在準備中です 🍜</p>
    </div>
  );
};

export default RestaurantMenu;
