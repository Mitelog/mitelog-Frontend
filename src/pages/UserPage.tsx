import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosApi from "../api/axiosApi"; // ✅ 커스텀 axios 인스턴스 사용
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
  const { id } = useParams(); // /users/:id
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<
    "review" | "restaurant" | "bookmark" | "reservation"
  >("review");
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    // ✅ 로그인 상태일 때만 본인 여부 확인
    if (token) {
      axiosApi
        .get("/members/me") // ✅ baseURL 자동 적용됨
        .then((res) => {
          const myId = res.data.data?.id ?? res.data.id; // 서버 구조 대응
          console.log("📌 내 ID:", myId, "URL 파라미터:", id);

          if (String(myId) === String(id)) {
            console.log("🚀 본인 계정 → 마이페이지로 이동");
            navigate("/mypage", { replace: true });
            return;
          }

          // 본인이 아니면 공개 프로필 조회
          fetchPublicProfile();
        })
        .catch((err) => {
          console.warn("⚠️ /members/me 호출 실패:", err);
          // 로그인 정보가 없거나 실패 → 공개 프로필만 불러오기
          fetchPublicProfile();
        });
    } else {
      // 비로그인 → 공개 프로필만 조회
      fetchPublicProfile();
    }
  }, [id, navigate]);

  // ✅ 공개 프로필 불러오기
  const fetchPublicProfile = () => {
    axiosApi
      .get(`/members/${id}/public`) // ✅ /api 자동 포함
      .then((res) => {
        const data = res.data.data ?? res.data;
        console.log("✅ 공개 프로필 응답:", data);
        setProfile(data);
        setIsFollowed(data.isFollowed ?? data.followed ?? false);
      })
      .catch((err) => {
        console.error("❌ 공개 프로필 불러오기 실패:", err);
        alert("사용자를 찾을 수 없습니다.");
        navigate("/");
      });
  };

  if (!profile) return <div>로딩 중...</div>;

  return (
    <div className="userpage-container">
      <UserHeader profile={profile} />

      {/* 본인 페이지는 이미 리다이렉트 처리됨 */}
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
