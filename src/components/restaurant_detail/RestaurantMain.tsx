import React from "react";

interface Props {
  restaurant: {
    address: string;
    description?: string;
    phone?: string;
  };
}

const RestaurantMain: React.FC<Props> = ({ restaurant }) => {
  return (
    <div>
      <h3>店舗情報</h3>
      <p>{restaurant.description || "説明がありません。"}</p>
      <p>📍 {restaurant.address}</p>
      {restaurant.phone && <p>📞 {restaurant.phone}</p>}
    </div>
  );
};

export default RestaurantMain;
