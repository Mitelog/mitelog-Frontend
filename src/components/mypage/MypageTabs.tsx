import React from "react";

interface Props {
  profile: {
    reviewCount: number;
    restaurantCount: number;
    bookmarkCount: number;
    reservationCount?: number; // ✅ 나중에 API 연결 대비
  };
  activeTab: "review" | "restaurant" | "bookmark" | "reservation";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"review" | "restaurant" | "bookmark" | "reservation">
  >;
}

const MypageTabs: React.FC<Props> = ({ profile, activeTab, setActiveTab }) => {
  const reservationCount = profile.reservationCount ?? 3;

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
        <span>私のレストラン</span>
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
        <span>私の予約</span>
        <strong>{reservationCount}</strong>
      </div>
    </div>
  );
};

export default MypageTabs;
