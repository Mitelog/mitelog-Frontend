import React from "react";
import "../styles/mypage.css";

interface Props {
  reviewCount: number;
  likeCount: number;
  bookmarkCount: number;
}

const MypageSummary: React.FC<Props> = ({ reviewCount, likeCount, bookmarkCount }) => {
  return (
    <div className="mypage-summary">
      <div className="summary-row">
        <span>리뷰</span>
        <span>{reviewCount}건</span>
      </div>
      <div className="summary-row">
        <span>좋아요</span>
        <span>{likeCount}건</span>
      </div>
      <div className="summary-row">
        <span>북마크</span>
        <span>{bookmarkCount}건</span>
      </div>
    </div>
  );
};

export default MypageSummary;
