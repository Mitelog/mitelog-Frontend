import React from "react";

interface Props {
  restaurant: {
    reviewCount?: number;
  };
  activeTab: "main" | "menu" | "review";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"main" | "menu" | "review">
  >;
}

const RestaurantTabs: React.FC<Props> = ({
  restaurant,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="restaurant-tabs">
      <div
        className={`tab ${activeTab === "main" ? "active" : ""}`}
        onClick={() => setActiveTab("main")}
      >
        <span>メイン</span>
      </div>
      <div
        className={`tab ${activeTab === "menu" ? "active" : ""}`}
        onClick={() => setActiveTab("menu")}
      >
        <span>メニュー</span>
      </div>
      <div
        className={`tab ${activeTab === "review" ? "active" : ""}`}
        onClick={() => setActiveTab("review")}
      >
        <span>口コミ ({restaurant.reviewCount ?? 0})</span>
      </div>
    </div>
  );
};

export default RestaurantTabs;
