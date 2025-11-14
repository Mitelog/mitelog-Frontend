import React, { useEffect, useState } from "react";
import axiosApi from "../../api/axiosApi";
import "/src/styles/mypage.css";
import MypageHeader from "../../components/mypage/MypageHeader";
import MypageTabs from "../../components/mypage/MypageTabs";
import MypageContent from "../../components/mypage/MypageContent";
import FollowListModal from "../../components/common/FollowListModal";
import MypageEditModal from "../../components/mypage/MypageEditModal";

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
  const [activeTab, setActiveTab] = useState<
    "review" | "restaurant" | "bookmark" | "reservation"
  >("review");
  const [modalType, setModalType] = useState<
    "followers" | "following" | "edit" | null
  >(null);

  useEffect(() => {
    axiosApi
      .get("/mypage/profile")
      .then((res) => setProfile(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const handleOpenModal = (type: "followers" | "following" | "edit") =>
    setModalType(type);
  const handleCloseModal = () => setModalType(null);

  if (!profile) return <p className="loading-text">読み込み中...</p>;

  return (
    <div className="mypage-container">
      <MypageHeader profile={profile} onOpenModal={handleOpenModal} />

      <MypageTabs
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <MypageContent activeTab={activeTab} />

      {/* ✅ 모달 타입에 따라 다른 모달 열기 */}
      {modalType === "followers" && (
        <FollowListModal
          userId={profile.id}
          type="followers"
          onClose={handleCloseModal}
        />
      )}

      {modalType === "following" && (
        <FollowListModal
          userId={profile.id}
          type="following"
          onClose={handleCloseModal}
        />
      )}

      {modalType === "edit" && (
        <MypageEditModal
          userId={profile.id}
          currentName={profile.name}
          currentEmail={profile.email}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Mypage;
