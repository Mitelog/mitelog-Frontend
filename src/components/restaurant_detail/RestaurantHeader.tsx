import React, { useState } from "react";
import BookmarkButton from "./BookmarkButton";

interface Props {
  restaurant: {
    id: number;
    name: string;
    averageRating?: number | null;
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
        <div className="restaurant-left">
          <h2 className="restaurant-title">{restaurant.name}</h2>
          {restaurant.categoryNames && restaurant.categoryNames.length > 0 && (
            <p className="restaurant-subtitle">
              {restaurant.categoryNames.join(" / ")}
            </p>
          )}
        </div>

        <div className="restaurant-right">
          {typeof restaurant.averageRating === "number" && (
            <div className="restaurant-rating">
              ⭐ {restaurant.averageRating.toFixed(1)}
            </div>
          )}
          <BookmarkButton restaurantId={restaurant.id} />
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeader;
