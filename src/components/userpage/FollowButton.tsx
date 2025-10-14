import React from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../../api/axiosApi"; // ✅ 커스텀 axios 인스턴스 사용

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
        // ✅ 언팔로우 요청
        await axiosApi.delete(`/follows/${targetId}`);
        setIsFollowed(false);
      } else {
        // ✅ 팔로우 요청
        await axiosApi.post(`/follows/${targetId}`);
        setIsFollowed(true);
      }
    } catch (err) {
      console.error("❌ 팔로우 처리 실패:", err);
      alert("팔로우 처리 중 오류가 발생했습니다.");
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
