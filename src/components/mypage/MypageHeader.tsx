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
  onOpenModal: (type: "followers" | "following" | "edit") => void;
}

const MypageHeader: React.FC<Props> = ({ profile, onOpenModal }) => {
  return (
    <div className="mypage-header">
      {/* ✅ 랜덤 배너 이미지 */}
      <div
        className="banner"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "180px",
          borderRadius: "12px 12px 0 0",
        }}
      ></div>

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

          {/* ✅ 프로필 수정 버튼 */}
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
