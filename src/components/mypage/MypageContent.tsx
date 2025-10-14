import React from "react";
import ReviewList from "./ReviewList";
import MyRestaurant from "./MyRestaurant";
import MyBookmarks from "./MyBookmarks";
import MyReservations from "./MyReservations";

interface Props {
  activeTab: "review" | "restaurant" | "bookmark" | "reservation";
}

const MypageContent: React.FC<Props> = ({ activeTab }) => {
  return (
    <div className="mypage-content">
      {activeTab === "review" && <ReviewList />}
      {activeTab === "restaurant" && <MyRestaurant />}
      {activeTab === "bookmark" && <MyBookmarks />}
      {activeTab === "reservation" && <MyReservations />}
    </div>
  );
};

export default MypageContent;
