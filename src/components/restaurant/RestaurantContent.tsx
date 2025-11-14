import React from "react";
import RestaurantMain from "./RestaurantMain";
import RestaurantMenu from "./RestaurantMenu";
import RestaurantReview from "./RestaurantReview";

interface Props {
  restaurant: any;
  activeTab: "main" | "menu" | "review";
}

const RestaurantContent: React.FC<Props> = ({ restaurant, activeTab }) => {
  return (
    <div className="restaurant-content">
      {activeTab === "main" && <RestaurantMain restaurant={restaurant} />}
      {activeTab === "menu" && (
        <RestaurantMenu
          restaurantId={restaurant.id}
          ownerId={restaurant.ownerId}
        />
      )}
      {activeTab === "review" && (
        <RestaurantReview restaurantId={restaurant.id} />
      )}
    </div>
  );
};

export default RestaurantContent;
