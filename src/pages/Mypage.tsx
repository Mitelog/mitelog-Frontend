import React, { useEffect, useState } from "react";
import axiosApi from "../api/axiosApi";
import "../styles/mypage.css";
import MypageHeader from "../components/mypage/MypageHeader";
import MypageTabs from "../components/mypage/MypageTabs";
import MypageContent from "../components/mypage/MypageContent";
import FollowListModal from "../components/common/FollowListModal"; // ✅ 추가

interface MypageProfile {
  id: number;
  email: string;
  name: string;
  reviewCount: number;
  visitCount: number;
  bookmarkCount: number;
  followerCount: number;
  followingCount: number;
  profileImage?: string | null;
}

const Mypage: React.FC = () => {
  const [profile, setProfile] = useState<MypageProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"review" | "restaurant" | "bookmark" | "reservation">("review");

  // ✅ 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "following">("followers");

  useEffect(() => {
    axiosApi
      .get("/mypage/profile")
      .then((res) => setProfile(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const handleOpenModal = (type: "followers" | "following") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  if (!profile) return <p className="loading-text">読み込み中...</p>;

  return (
    <div className="mypage-container">
      <MypageHeader
        profile={profile}
        onOpenModal={handleOpenModal} // ✅ 추가 전달
      />
      <MypageTabs profile={profile} activeTab={activeTab} setActiveTab={setActiveTab} />
      <MypageContent activeTab={activeTab} />

      {isModalOpen && (
        <FollowListModal
          userId={profile.id}
          type={modalType}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Mypage;
