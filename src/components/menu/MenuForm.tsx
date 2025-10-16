import React, { useState, useEffect } from "react";
import axiosApi from "../../api/axiosApi";

interface MenuFormProps {
  restaurantId: number;
  menu?: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    description?: string;
    category?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const MenuForm: React.FC<MenuFormProps> = ({
  restaurantId,
  menu,
  onSuccess,
  onCancel,
}) => {
  const [name, setName] = useState(menu?.name || "");
  const [price, setPrice] = useState(menu?.price || 0);
  const [imageUrl, setImageUrl] = useState(menu?.imageUrl || "");
  const [description, setDescription] = useState(menu?.description || "");
  const [category, setCategory] = useState(menu?.category || "");

  const isEdit = !!menu;

  // ✅ 수정 모드일 때 기존 값 세팅
  useEffect(() => {
    if (menu) {
      setName(menu.name);
      setPrice(menu.price);
      setImageUrl(menu.imageUrl || "");
      setDescription(menu.description || "");
      setCategory(menu.category || "");
    }
  }, [menu]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, price, imageUrl, description, category };

    try {
      if (isEdit) {
        await axiosApi.put(`/menus/${menu!.id}`, payload);
        alert("메뉴가 수정되었습니다.");
      } else {
        await axiosApi.post(`/menus/restaurant/${restaurantId}`, payload);
        alert("메뉴가 등록되었습니다.");
      }
      onSuccess();
    } catch (err) {
      console.error("메뉴 등록/수정 실패:", err);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="menu-form">
      <h4 className="menu-form-title">
        {isEdit ? "✏️ 메뉴 수정" : "🍴 새 메뉴 등록"}
      </h4>

      <div className="form-group">
        <label>메뉴명</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>가격</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
      </div>

      <div className="form-group">
        <label>이미지 URL</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="form-group">
        <label>카테고리</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="예: 라멘, 사이드, 음료 등"
        />
      </div>

      <div className="form-group">
        <label>설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="간단한 설명을 입력하세요"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="form-submit-btn">
          {isEdit ? "수정 완료" : "등록"}
        </button>
        <button type="button" onClick={onCancel} className="form-cancel-btn">
          취소
        </button>
      </div>
    </form>
  );
};

export default MenuForm;
