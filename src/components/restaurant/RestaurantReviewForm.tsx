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
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null); // ✅ 이미지 상태만 유지 (아직 서버 미연동)

  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("ログインが必要です。");
      return;
    }

    if (!title.trim() || !rating || !content.trim()) {
      alert("タイトル、評価、レビュー内容を入力してください。");
      return;
    }

    try {
      // ✅ 이미지 업로드는 아직 미구현 → null로 전송
      await axiosApi.post("/reviews", {
        restaurantId,
        rating,
        title,
        content,
        image: null, // 임시 값
      });

      alert("レビューが登録されました！");
      setTitle("");
      setRating(0);
      setContent("");
      setImage(null);
      onReviewAdded();
    } catch (err) {
      console.error("리뷰 등록 실패:", err);
      alert("レビュー登録に失敗しました。");
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>レビューを書く</h3>

      <div className="form-group">
        <label>タイトル:</label>
        <input
          type="text"
          placeholder="タイトルを入力してください"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

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

      {/* ✅ 이미지 업로드 버튼 (아직 기능 없음) */}
      <div className="form-group">
        <label>画像 (準備中):</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          disabled // 아직 비활성화
        />
        <small style={{ color: "#888" }}>
          ※ 画像アップロード機能は現在準備中です。
        </small>
      </div>

      <button type="submit" className="review-submit-btn">
        登録
      </button>
    </form>
  );
};

export default RestaurantReviewForm;
