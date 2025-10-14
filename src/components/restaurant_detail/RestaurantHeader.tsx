import React from "react";

interface Props {
  restaurant: {
    name: string;
    rating?: number;
    categoryNames?: string[];
    imageUrl?: string;
  };
}

const RestaurantHeader: React.FC<Props> = ({ restaurant }) => {
  return (
    <div className="restaurant-header">
      <div
        className="banner"
        style={{
          backgroundImage: `url(${
            restaurant.imageUrl || "/default-restaurant.jpg"
          })`,
        }}
      />
      <div className="restaurant-info">
        <div>
          <h2 className="restaurant-title">{restaurant.name}</h2>
          {restaurant.categoryNames && (
            <p className="restaurant-subtitle">
              {restaurant.categoryNames.join(" / ")}
            </p>
          )}
        </div>
        {restaurant.rating !== undefined && (
          <div className="restaurant-rating">
            ⭐ {restaurant.rating.toFixed(1)}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantHeader;
