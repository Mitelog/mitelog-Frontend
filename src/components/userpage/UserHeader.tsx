import React from "react";
import "../../styles/userpage.css";

interface Props {
  profile: {
    name: string;
    email: string;
    profileImage?: string | null;
    reviewCount: number;
    bookmarkCount: number;
    followerCount: number;
    followingCount: number;
  };
}

const UserHeader: React.FC<Props> = ({ profile }) => {
  return (
    <div className="user-header">
      <div className="banner"></div>
      <div className="profile-row">
        <div className="profile-left">
          <img
            src={profile.profileImage || "/default-profile.png"}
            alt="profile"
            className="profile-photo"
          />
          <div className="profile-text">
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
          </div>
        </div>

        <div className="profile-right">
          <div className="summary">
            <div>
              <span>리뷰</span>
              <strong>{profile.reviewCount}</strong>
            </div>
            <div>
              <span>팔로워</span>
              <strong>{profile.followerCount}</strong>
            </div>
            <div>
              <span>팔로잉</span>
              <strong>{profile.followingCount}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
