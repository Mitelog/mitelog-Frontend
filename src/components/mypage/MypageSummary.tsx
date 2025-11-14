import React from "react";
import "/src/styles/mypage.css";

interface Props {
  reviewCount: number;
  likeCount: number;
  bookmarkCount: number;
}

const MypageSummary: React.FC<Props> = ({
  reviewCount,
  likeCount,
  bookmarkCount,
}) => {
  return (
    <div className="mypage-summary">
      <div className="summary-row">
        <span>レビュー</span>
        <span>{reviewCount}件</span>
      </div>
      <div className="summary-row">
        <span>いいね</span>
        <span>{likeCount}件</span>
      </div>
      <div className="summary-row">
        <span>ブックマーク</span>
        <span>{bookmarkCount}件</span>
      </div>
    </div>
  );
};

export default MypageSummary;
