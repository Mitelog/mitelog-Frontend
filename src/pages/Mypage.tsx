import React, { useEffect, useState } from "react";
import axiosApi from "../api/axiosApi";
import "../styles/mypage.css";
import MypageHeader from "../components/mypage/MypageHeader";
import MypageTabs from "../components/mypage/MypageTabs";
import MypageContent from "../components/mypage/MypageContent";

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
    axiosApi
      .get("/mypage/profile")
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
