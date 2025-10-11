import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosApi from "../api/axiosApi";
import "../styles/restaurantForm.css";

interface RestaurantFormData {
  name: string;
  address: string,
  area: string,
  phone?: string;
  description?: string;
}

const RestaurantForm: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // 수정 시 존재
  const navigate = useNavigate();
  const isEditMode = !!id; // id가 있으면 수정 모드

  const [formData, setFormData] = useState<RestaurantFormData>({
    name: "",
    address: "",
    area: "",
    phone: "",
    description: "",
  });

  const [loading, setLoading] = useState(isEditMode); // 수정일 때만 로딩
  const [error, setError] = useState<string | null>(null);

  // ✅ 수정 모드일 경우 기존 데이터 불러오기
  useEffect(() => {
    if (!isEditMode) return;

    const fetchRestaurant = async () => {
      try {
        const res = await axiosApi.get(`/restaurants/${id}`);
        const { name, address, area, phone, description } = res.data;
        setFormData({ name, address, area, phone, description });
      } catch (err) {
        console.error("식당 데이터 로드 실패:", err);
        setError("店舗情報の読み込みに失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  // ✅ 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 등록 / 수정 요청
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await axiosApi.put(`/restaurants/${id}`, formData);
        alert("店舗情報を更新しました。");
      } else {
        await axiosApi.post("/restaurants", formData);
        alert("新しいレストランを登録しました。");
      }

      navigate("/restaurants");
    } catch (err) {
      console.error("요청 실패:", err);
      setError("データの送信に失敗しました。");
    }
  };

  if (loading) return <p className="loading">読み込み中...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="restaurant-form-container">
      <h2>{isEditMode ? "店舗情報の編集" : "新しいレストランを登録"}</h2>

      <form onSubmit={handleSubmit} className="restaurant-form">
        <label>
          店舗名
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          住所
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          エリア（地域）
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="例: 大邱広域市"
            required
          />
        </label>

        <label>
          電話番号
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          説明
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </label>

        <button type="submit" className="submit-btn">
          {isEditMode ? "更新する" : "登録する"}
        </button>
      </form>
    </div>
  );
};

export default RestaurantForm;
