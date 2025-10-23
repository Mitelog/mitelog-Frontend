import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosApi";
import "../restaurant_detail/restaurantReview.css";

interface Review {
  id: number;
  memberName: string;
  title: string;
  rating: number;
  content: string;
  createdAt: string;
  likeCount?: number; // ✅ 추가
  likedByMe?: boolean; // ✅ 추가
}

interface Props {
  reviews: Review[];
}

/** ✅ 파일 내부 전용 좋아요 버튼 (공용 컴포넌트 아님) */
function InlineLikeButton({
  reviewId,
  initialCount = 0,
  initialLiked = false,
}: {
  reviewId: number;
  initialCount?: number;
  initialLiked?: boolean;
}) {
  const [count, setCount] = useState<number>(initialCount);
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (loading) return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      if (!liked) {
        const res = await axiosApi.post(`/likes/${reviewId}`);
        setCount(typeof res.data === "number" ? res.data : count + 1);
        setLiked(true);
      } else {
        const res = await axiosApi.delete(`/likes/${reviewId}`);
        setCount(
          typeof res.data === "number" ? res.data : Math.max(0, count - 1)
        );
        setLiked(false);
      }
    } catch (err) {
      console.error("좋아요 토글 실패:", err);
      // 401 등 에러 시 로그인 유도
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`like-button ${liked ? "active" : ""}`}
      onClick={handleClick}
      type="button"
      aria-pressed={liked}
      disabled={loading}
      title={liked ? "いいねを取り消す" : "いいね"}
    >
      👍 {count}
    </button>
  );
}

const RestaurantReviewList: React.FC<Props> = ({ reviews }) => {
  if (reviews.length === 0)
    return <p className="no-review-text">まだレビューがありません。</p>;

  return (
    <div className="review-list">
      {reviews.map((r) => (
        <div className="review-card" key={r.id}>
          {/* 상단: 작성자 + 평점 */}
          <div className="review-header">
            <span className="review-author">{r.memberName}</span>
            <span className="review-rating">⭐ {r.rating}</span>
          </div>

          {/* ✅ 제목 */}
          <h4 className="review-title">{r.title}</h4>

          {/* 본문 */}
          <p className="review-content">{r.content}</p>

          {/* ✅ 하단: 날짜(왼쪽) — 좋아요 버튼(오른쪽) */}
          <div className="review-footer">
            <span className="review-date">
              {new Date(r.createdAt).toLocaleDateString("ja-JP")}
            </span>
            <InlineLikeButton
              reviewId={r.id}
              initialCount={r.likeCount ?? 0}
              initialLiked={!!r.likedByMe}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantReviewList;
