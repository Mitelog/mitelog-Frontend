import React, { useState } from "react";
import axiosApi from "../../api/axiosApi";

interface Props {
  restaurantId: number;
  onReviewAdded: () => void;
}

const RestaurantReviewForm: React.FC<Props> = ({
  restaurantId,
  onReviewAdded,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState("");

  /** ✅ 로그인 여부 확인 */
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("ログインが必要です。");
      return;
    }

    if (!rating || !content.trim()) {
      alert("評価とレビュー内容を入力してください。");
      return;
    }

    try {
      await axiosApi.post("/reviews", { restaurantId, rating, content });
      alert("レビューが登録されました！");
      setRating(0);
      setContent("");
      onReviewAdded(); // ✅ 부모로 콜백 전달 (목록 새로고침 + 모달 닫기)
    } catch (err) {
      console.error("리뷰 등록 실패:", err);
      alert("レビュー登録に失敗しました。");
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>レビューを書く</h3>

      <div className="form-group">
        <label>評価 (1〜5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label>内容:</label>
        <textarea
          placeholder="レビュー内容を入力してください"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
      </div>

      <button type="submit" className="review-submit-btn">
        登録
      </button>
    </form>
  );
};

export default RestaurantReviewForm;
