import React from "react";

interface Props {
  restaurantId: number;
}

const RestaurantMenu: React.FC<Props> = () => {
  return (
    <div className="restaurant-menu">
      <p>メニュー情報は現在準備中です。</p>
    </div>
  );
};

export default RestaurantMenu;
