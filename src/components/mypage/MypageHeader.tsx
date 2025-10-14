import React from "react";
import MypageSummary from "./MypageSummary";

interface Props {
  profile: {
    name: string;
    email: string;
    profileImage?: string | null;
    reviewCount: number;
    bookmarkCount: number;
  };
}

const MypageHeader: React.FC<Props> = ({ profile }) => {
  return (
    <div className="mypage-header">
      <div className="banner"></div>

      {/* ✅ 프로필 + 요약 박스 같은 행으로 배치 */}
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
          <button className="edit-btn">マイページの設定</button>
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
