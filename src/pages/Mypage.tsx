import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "../styles/mypage.css";
import MypageHeader from "../components/MypageHeader";
import MypageTabs from "../components/MypageTabs";
import MypageContent from "../components/MypageContent";
import MypageSummary from "../components/MypageSummary";

interface MypageProfile {
  email: string;
  name: string;
  reviewCount: number;
  visitCount: number;
  bookmarkCount: number;
  profileImage?: string | null;
  id: number;
}

const Mypage: React.FC = () => {
  const [profile, setProfile] = useState<MypageProfile | null>(null);
  const [activeTab, setActiveTab] = useState<
    "review" | "restaurant" | "bookmark" | "reservation"
  >("review");

  useEffect(() => {
    axiosInstance
      .get("/api/mypage/profile")
      .then((res) => setProfile(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  if (!profile) return <p className="loading-text">読み込み中...</p>;

  return (
    <div className="mypage-container">
      <MypageHeader profile={profile} />
      <MypageTabs profile={profile} activeTab={activeTab} setActiveTab={setActiveTab} />
      <MypageContent activeTab={activeTab} />
    </div>
  );
};

export default Mypage;
