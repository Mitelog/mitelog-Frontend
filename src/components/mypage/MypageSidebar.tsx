import React from "react";

interface Props {
  activeTab: "review" | "restaurant" | "reservation";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"review" | "restaurant" | "reservation">
  >;
}

const MypageSidebar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mypage-sidebar">
      <button
        className={activeTab === "review" ? "active" : ""}
        onClick={() => setActiveTab("review")}
      >
        📝 レビュー
      </button>
      <button
        className={activeTab === "restaurant" ? "active" : ""}
        onClick={() => setActiveTab("restaurant")}
      >
        🍴 내 가게
      </button>
      <button
        className={activeTab === "reservation" ? "active" : ""}
        onClick={() => setActiveTab("reservation")}
      >
        📅 내 예약
      </button>
    </div>
  );
};

export default MypageSidebar;
