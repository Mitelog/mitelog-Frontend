import React, { useEffect, useState } from "react";
import axiosApi from "../../api/axiosApi";
import "/src/styles/menuList.css";

interface Menu {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  category?: string;
}

interface MenuListProps {
  restaurantId: number;
  isOwner: boolean;
  onEdit: (menu: Menu) => void;
}

const MenuList: React.FC<MenuListProps> = ({
  restaurantId,
  isOwner,
  onEdit,
}) => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await axiosApi.get(`/menus/restaurant/${restaurantId}`);
        setMenus(res.data);
      } catch (err) {
        console.error("메뉴 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, [restaurantId]);

  const handleDelete = async (menuId: number) => {
    if (!window.confirm("이 메뉴를 삭제하시겠습니까?")) return;
    try {
      await axiosApi.delete(`/menus/${menuId}`);
      alert("메뉴가 삭제되었습니다.");
      setMenus((prev) => prev.filter((m) => m.id !== menuId));
    } catch (err) {
      console.error("메뉴 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p className="menu-loading">🍳 메뉴를 불러오는 중...</p>;
  if (menus.length === 0)
    return <p className="menu-empty">등록된 메뉴가 없습니다.</p>;

  // ✅ 카테고리별 그룹화
  const grouped = menus.reduce<Record<string, Menu[]>>((acc, menu) => {
    const category = menu.category || "기타 메뉴";
    if (!acc[category]) acc[category] = [];
    acc[category].push(menu);
    return acc;
  }, {});

  return (
    <div className="menu-section">
      <div className="menu-header">
        <h3>🍽️ 요리 메뉴</h3>
        <span className="menu-note">(세금 포함 가격)</span>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="menu-category-block">
          <h4 className="menu-category-title">{category}</h4>

          <ul className="menu-list">
            {items.map((menu) => (
              <li key={menu.id} className="menu-item">
                {menu.imageUrl && (
                  <img
                    src={menu.imageUrl}
                    alt={menu.name}
                    className="menu-image"
                  />
                )}
                <div className="menu-info">
                  <div className="menu-title">
                    <span className="menu-name">{menu.name}</span>
                    <span className="menu-price">
                      {menu.price.toLocaleString()}원
                    </span>
                  </div>
                  {menu.description && (
                    <p className="menu-desc">{menu.description}</p>
                  )}
                  {isOwner && (
                    <div className="menu-actions">
                      <button
                        className="menu-edit-btn"
                        onClick={() => onEdit(menu)}
                      >
                        ✏️ 수정
                      </button>
                      <button
                        className="menu-delete-btn"
                        onClick={() => handleDelete(menu.id)}
                      >
                        ❌ 삭제
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MenuList;
