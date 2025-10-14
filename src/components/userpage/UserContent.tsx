import React from "react";
import ReviewList from "./ReviewList";
import MyBookmarks from "./MyBookmarks";

interface Props {
  activeTab: "review" | "restaurant" | "bookmark" | "reservation";
}

const UserContent: React.FC<Props> = ({ activeTab }) => {
  return (
    <div className="user-content">
      {activeTab === "review" && <ReviewList />}
      {activeTab === "bookmark" && <MyBookmarks />}
    </div>
  );
};

export default UserContent;
