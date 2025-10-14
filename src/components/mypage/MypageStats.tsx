import React from "react";

interface Props {
  profile: {
    reviewCount: number;
    visitCount: number;
    bookmarkCount: number;
  };
}

const MypageStats: React.FC<Props> = ({ profile }) => {
  return (
    <div className="mypage-stats">
      <div className="stat">
        <span className="num">{profile.reviewCount}</span>
        <span className="label">口コミ</span>
      </div>
      <div className="stat">
        <span className="num">{profile.visitCount}</span>
        <span className="label">行った店</span>
      </div>
      <div className="stat">
        <span className="num">{profile.bookmarkCount}</span>
        <span className="label">ブックマーク</span>
      </div>
    </div>
  );
};

export default MypageStats;
