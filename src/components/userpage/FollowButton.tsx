import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Props {
  targetId: number;
  isFollowed: boolean;
  setIsFollowed: React.Dispatch<React.SetStateAction<boolean>>;
}

const FollowButton: React.FC<Props> = ({ targetId, isFollowed, setIsFollowed }) => {
  const navigate = useNavigate();

  const handleFollow = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login");
      return;
    }

    try {
      if (isFollowed) {
        await axios.delete(`/api/follows/${targetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFollowed(false);
      } else {
        await axios.post(`/api/follows/${targetId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFollowed(true);
      }
    } catch (err) {
      console.error("팔로우 처리 실패:", err);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <button
      className={`follow-btn ${isFollowed ? "active" : ""}`}
      onClick={handleFollow}
    >
      {isFollowed ? "フォロー中" : "フォロー"}
    </button>
  );
};

export default FollowButton;
