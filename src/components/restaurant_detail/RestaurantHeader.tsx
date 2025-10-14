import React from "react";

interface Props {
  restaurant: any;
}

const RestaurantHeader: React.FC<Props> = ({ restaurant }) => {
  return (
    <div className="restaurant-header">
      <div className="banner"></div>
      <div className="header-content">
        <img
          src={restaurant.imageUrl || "/images/default-restaurant.jpg"}
          alt={restaurant.name}
          className="restaurant-image"
        />
        <div className="header-text">
          <h2>{restaurant.name}</h2>
          <p>{restaurant.address}</p>
          {restaurant.categoryNames && (
            <p className="categories">{restaurant.categoryNames.join(", ")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeader;
