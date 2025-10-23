import React from "react";
import UserReviews from "./UserReviews";
import UserRestaurants from "./UserRestaurants";
import UserBookmarks from "./UserBookmarks";

interface Props {
  activeTab: "review" | "restaurant" | "bookmark" | "reservation";
}

const UserContent: React.FC<Props> = ({ activeTab }) => {
  return (
    <div className="user-content">
      {activeTab === "review" && <UserReviews />}
      {activeTab === "restaurant" && <UserRestaurants />}
      {activeTab === "bookmark" && <UserBookmarks />}
      {activeTab === "reservation" && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          予約情報はまだ実装されていません。
        </p>
      )}
    </div>
  );
};

export default UserContent;
