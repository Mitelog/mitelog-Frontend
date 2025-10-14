import React, { useEffect, useState } from "react";
import axiosApi from "../../api/axiosApi"; // ✅ 수정
import "../../styles/followModal.css";

interface FollowUser {
  memberId: number;
  name: string;
  email: string;
}

interface Props {
  userId: number;
  type: "followers" | "following";
  onClose: () => void;
}

const FollowListModal: React.FC<Props> = ({ userId, type, onClose }) => {
  const [list, setList] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosApi
      .get(`/follow/${type}/${userId}`) // ✅ baseURL 자동 (/api 포함)
      .then((res) => {
        setList(res.data.data || []);
      })
      .catch((err) => console.error("❌ 목록 불러오기 실패:", err))
      .finally(() => setLoading(false));
  }, [userId, type]);

  return (
    <div className="follow-modal-overlay">
      <div className="follow-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>{type === "followers" ? "フォロワー一覧" : "フォロー中一覧"}</h3>

        {loading ? (
          <p>読み込み中...</p>
        ) : list.length === 0 ? (
          <p>ユーザーがいません。</p>
        ) : (
          <ul>
            {list.map((user) => (
              <li key={user.memberId} className="follow-item">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FollowListModal;
