import React from "react";
import MypageSummary from "./MypageSummary";

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
  onOpenModal: (type: "followers" | "following" | "edit") => void; // ✅ edit 추가
}

const MypageHeader: React.FC<Props> = ({ profile, onOpenModal }) => {
  return (
    <div className="mypage-header">
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

            {/* ✅ 클릭 시 팔로워/팔로잉 모달 */}
            <div className="follow-stats">
              <span
                onClick={() => onOpenModal("followers")}
                className="clickable"
              >
                フォロワー: {profile.followerCount}
              </span>
              <span
                onClick={() => onOpenModal("following")}
                className="clickable"
              >
                フォロー中: {profile.followingCount}
              </span>
            </div>
          </div>

          {/* ✅ 프로필 수정 버튼 (회원 수정/탈퇴 모달 오픈) */}
          <button className="edit-btn" onClick={() => onOpenModal("edit")}>
            マイページの設定
          </button>
        </div>

        <div className="profile-right">
          <MypageSummary
            reviewCount={profile.reviewCount}
            likeCount={0}
            bookmarkCount={profile.bookmarkCount}
          />
        </div>
      </div>
    </div>
  );
};

export default MypageHeader;
