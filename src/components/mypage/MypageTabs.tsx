import React from "react";

interface Props {
  profile: {
    reviewCount: number;
    restaurantCount: number;
    bookmarkCount: number;
  };
  activeTab: "review" | "restaurant" | "bookmark" | "reservation";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"review" | "restaurant" | "bookmark" | "reservation">
  >;
}

const MypageTabs: React.FC<Props> = ({ profile, activeTab, setActiveTab }) => {
  return (
    <div className="mypage-tabs">
      <div
        className={`tab ${activeTab === "review" ? "active" : ""}`}
        onClick={() => setActiveTab("review")}
      >
        <span>口コミ</span>
        <strong>{profile.reviewCount}</strong>
      </div>
      <div
        className={`tab ${activeTab === "restaurant" ? "active" : ""}`}
        onClick={() => setActiveTab("restaurant")}
      >
        <span>나의 가게</span>
        <strong>{profile.restaurantCount}</strong>
      </div>
      <div
        className={`tab ${activeTab === "bookmark" ? "active" : ""}`}
        onClick={() => setActiveTab("bookmark")}
      >
        <span>ブックマーク</span>
        <strong>{profile.bookmarkCount}</strong>
      </div>
      <div
        className={`tab ${activeTab === "reservation" ? "active" : ""}`}
        onClick={() => setActiveTab("reservation")}
      >
        <span>내 예약</span>
      </div>
    </div>
  );
};

export default MypageTabs;
