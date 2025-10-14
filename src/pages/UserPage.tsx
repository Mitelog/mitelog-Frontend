import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import UserHeader from "../components/userpage/UserHeader";
import UserTabs from "../components/userpage/UserTabs";
import UserContent from "../components/userpage/UserContent";
import FollowButton from "../components/userpage/FollowButton";
import "../styles/userpage.css";

interface Profile {
  id: number;
  name: string;
  email: string;
  profileImage?: string | null;
  reviewCount: number;
  bookmarkCount: number;
  followerCount: number;
  followingCount: number;
  isFollowed?: boolean;
}

const UserPage: React.FC = () => {
  const { id } = useParams(); // URL 파라미터 (/users/:id)
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<
    "review" | "restaurant" | "bookmark" | "reservation"
  >("review");
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    // ✅ 로그인되어 있다면 본인인지 확인
    if (token) {
      axios
        .get("/api/members/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const myId = res.data.id;

          console.log("📌 내 ID:", myId, "URL 파라미터:", id);

          // ✅ 본인 ID면 즉시 마이페이지로 리다이렉트
          if (String(myId) === String(id)) {
            console.log("🚀 본인 계정 → 마이페이지로 이동");
            navigate("/mypage", { replace: true });
            return; // 아래 코드 실행 방지
          }

          // ✅ 본인이 아니면 공개 프로필 로드
          fetchPublicProfile(token);
        })
        .catch((err) => {
          console.warn("⚠️ /api/members/me 호출 실패:", err);
          // 로그인 실패 시에도 공개 프로필 불러오기
          fetchPublicProfile(token);
        });
    } else {
      // ✅ 비로그인 상태 → 공개 프로필만 로드
      fetchPublicProfile(token);
    }
  }, [id, navigate]);

  // ✅ 공개 프로필 불러오기 함수
  const fetchPublicProfile = (token: string | null) => {
    axios
      .get(`/api/members/${id}/public`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        console.log("✅ 공개 프로필 응답:", res.data);
        setProfile(res.data);
        setIsFollowed(res.data.isFollowed);
      })
      .catch((err) => {
        console.error("❌ 공개 프로필 불러오기 실패:", err);
        alert("사용자를 찾을 수 없습니다.");
        navigate("/");
      });
  };

  // ✅ 로딩 중 상태 처리
  if (!profile) return <div>로딩 중...</div>;

  return (
    <div className="userpage-container">
      <UserHeader profile={profile} />

      {/* 본인 페이지에서는 이미 /mypage로 리다이렉트되므로 여기엔 타인만 표시됨 */}
      <FollowButton
        targetId={profile.id}
        isFollowed={isFollowed}
        setIsFollowed={setIsFollowed}
      />

      <UserTabs
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <UserContent activeTab={activeTab} />
    </div>
  );
};

export default UserPage;
