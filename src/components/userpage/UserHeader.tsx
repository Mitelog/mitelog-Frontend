import React, { useState } from "react";
import FollowListModal from "../common/FollowListModal";
import "/src/styles/userpage.css";

interface Props {
  profile: {
    id: number;
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
  const [openType, setOpenType] = useState<"followers" | "following" | null>(
    null
  );

  return (
    <div className="user-header">
      <div className="banner"></div>
      <div className="profile-row">
        <div className="profile-left">
          <img
            src={profile.profileImage || "/images/profile-default.jpg"}
            alt="profile"
            className="profile-photo"
          />
          <div className="profile-text">
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>

            {/* ✅ 팔로워 / 팔로잉 카운트 클릭 가능 */}
            <div className="follow-stats">
              <span onClick={() => setOpenType("followers")}>
                フォロワー: {profile.followerCount}
              </span>
              <span onClick={() => setOpenType("following")}>
                フォロー中: {profile.followingCount}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-right">
          <div className="summary">
            <div>
              <span>口コミ</span>
              {/* <strong>{profile.reviewCount}</strong> */}
              <strong>3</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 모달 표시 */}
      {openType && (
        <FollowListModal
          userId={profile.id}
          type={openType}
          onClose={() => setOpenType(null)}
        />
      )}
    </div>
  );
};

export default UserHeader;
