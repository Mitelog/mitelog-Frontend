import React, { useState } from "react";
import axiosApi from "../../api/axiosApi";
import "/src/styles/mypageEditModal.css";

interface Props {
  userId: number;
  currentName: string;
  currentEmail: string;
  onClose: () => void;
}

const MypageEditModal: React.FC<Props> = ({
  userId,
  currentName,
  currentEmail,
  onClose,
}) => {
  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail);
  const [loading, setLoading] = useState(false);

  // ✅ 회원정보 수정
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosApi.put(`/members/${userId}`, { name, email });
      alert("プロフィールを更新しました。");
      window.location.reload(); // 갱신
    } catch (err) {
      console.error("회원 수정 실패:", err);
      alert("更新に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 회원탈퇴 (DELETE)
  const handleDelete = async () => {
    if (
      !window.confirm(
        "本当に退会しますか？\n(すべてのレビューや予約が削除されます)"
      )
    )
      return;

    try {
      await axiosApi.delete(`/members/${userId}`);
      alert("退会が完了しました。ご利用ありがとうございました。");

      // 로컬 정보 제거
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      console.error("회원 탈퇴 실패:", err);
      alert("退会に失敗しました。");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>プロフィール編集</h2>

        <form onSubmit={handleUpdate}>
          <label>名前</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="modal-buttons">
            <button type="submit" disabled={loading} className="save-btn">
              {loading ? "更新中..." : "保存"}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              キャンセル
            </button>
          </div>
        </form>

        <hr />
        <button onClick={handleDelete} className="delete-btn">
          会員退会
        </button>
      </div>
    </div>
  );
};

export default MypageEditModal;
