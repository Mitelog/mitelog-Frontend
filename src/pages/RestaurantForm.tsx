import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosApi from "../api/axiosApi";
import "../styles/restaurantForm.css";

interface RestaurantFormData {
  name: string;
  address: string;
  area: string;
  phone?: string;
  description?: string;
}

/** ✅ 카테고리 타입 정의 */
interface Category {
  id: number;
  name: string;
}

const RestaurantForm: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // 수정 모드 여부
  const navigate = useNavigate();
  const isEditMode = !!id; // id가 있으면 수정 모드

  const [formData, setFormData] = useState<RestaurantFormData>({
    name: "",
    address: "",
    area: "",
    phone: "",
    description: "",
  });

  /** ✅ 카테고리 관련 상태 추가 */
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  // ✅ 1. 카테고리 목록 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosApi.get("/categories");
        setCategories([...res.data]);
      } catch (err) {
        console.error("카테고리 불러오기 실패:", err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ 2. 수정 모드일 경우 기존 데이터 불러오기
  useEffect(() => {
    if (!isEditMode) return;

    const fetchRestaurant = async () => {
      try {
        const res = await axiosApi.get(`/restaurants/${id}`);
        const { name, address, area, phone, description, categoryIds } =
          res.data;

        setFormData({ name, address, area, phone, description });

        // ✅ 기존 선택된 카테고리 세팅
        if (categoryIds && Array.isArray(categoryIds)) {
          setSelectedCategories(categoryIds);
        }
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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 카테고리 체크박스 핸들러
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // ✅ 등록 / 수정 요청
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ categoryIds 추가해서 전송
    const requestData = {
      ...formData,
      categoryIds: selectedCategories,
    };

    try {
      if (isEditMode) {
        await axiosApi.put(`/restaurants/${id}`, requestData);
        alert("店舗情報を更新しました。");
      } else {
        console.log("📦 보낼 formData:", requestData);
        await axiosApi.post("/restaurants", requestData);
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

        {/* ✅ 카테고리 선택 영역 */}
        <div className="category-section">
          <p>カテゴリー選択</p>
          <div className="category-list">
            {/* ✅ 여기에 조건문 추가 */}
            {Array.isArray(categories) &&
              categories.map((cat) => (
                <label key={cat.id} className="category-item">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => handleCategoryChange(cat.id)}
                  />
                  {cat.name}
                </label>
              ))}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          {isEditMode ? "更新する" : "登録する"}
        </button>
      </form>
    </div>
  );
};

export default RestaurantForm;
