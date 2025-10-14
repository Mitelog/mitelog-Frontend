import React from "react";

interface Props {
  profile: {
    reviewCount: number;
    bookmarkCount: number;
  };
  activeTab: "review" | "restaurant" | "bookmark" | "reservation";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"review" | "restaurant" | "bookmark" | "reservation">
  >;
}

const UserTabs: React.FC<Props> = ({ profile, activeTab, setActiveTab }) => {
  return (
    <div className="user-tabs">
      <div
        className={`tab ${activeTab === "review" ? "active" : ""}`}
        onClick={() => setActiveTab("review")}
      >
        <span>口コミ</span>
        <strong>{profile.reviewCount}</strong>
      </div>
      <div
        className={`tab ${activeTab === "bookmark" ? "active" : ""}`}
        onClick={() => setActiveTab("bookmark")}
      >
        <span>ブックマーク</span>
        <strong>{profile.bookmarkCount}</strong>
      </div>
    </div>
  );
};

export default UserTabs;
