import React from "react";

interface Props {
  restaurant: any;
  activeTab: "main" | "menu" | "review";
  setActiveTab: React.Dispatch<React.SetStateAction<"main" | "menu" | "review">>;
}

const RestaurantTabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="restaurant-tabs">
      <div
        className={`tab ${activeTab === "main" ? "active" : ""}`}
        onClick={() => setActiveTab("main")}
      >
        メイン
      </div>
      <div
        className={`tab ${activeTab === "menu" ? "active" : ""}`}
        onClick={() => setActiveTab("menu")}
      >
        メニュー
      </div>
      <div
        className={`tab ${activeTab === "review" ? "active" : ""}`}
        onClick={() => setActiveTab("review")}
      >
        レビュー
      </div>
    </div>
  );
};

export default RestaurantTabs;
