import React, { useState } from "react";
import MenuList from "../menu/MenuList";
import MenuForm from "../menu/MenuForm";
import "/src/styles/restaurantMenu.css";

interface RestaurantMenuProps {
  restaurantId: number;
  ownerId: number;
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

const RestaurantMenu: React.FC<RestaurantMenuProps> = ({
  restaurantId,
  ownerId,
}) => {
  const loggedInUserId = localStorage.getItem("memberId");
  const isOwner = loggedInUserId && Number(loggedInUserId) === ownerId;

  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (menu: MenuItem) => {
    setEditingMenu(menu);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setEditingMenu(null);
    setIsModalOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  const handleCancel = () => {
    setEditingMenu(null);
    setIsModalOpen(false);
  };

  // ✅ 임시 더미 데이터 (이미지 없는 경우용)
  const mockMenus: MenuItem[] = [
    {
      id: 1,
      name: "牛タン定食（ぎゅうたんていしょく）",
      price: 1800,
      description: "厚切りの牛タンを炭火で香ばしく焼き上げた人気メニュー。",
      imageUrl: "https://picsum.photos/400/250?random=1",
    },
    {
      id: 2,
      name: "海鮮丼（かいせんどん）",
      price: 1600,
      description: "新鮮なマグロとサーモンを贅沢に盛り付けた海鮮丼。",
      imageUrl: "https://picsum.photos/400/250?random=2",
    },
    {
      id: 3,
      name: "抹茶ティラミス",
      price: 700,
      description: "ほろ苦い抹茶とクリーミーなマスカルポーネの絶妙なデザート。",
      imageUrl: "https://picsum.photos/400/250?random=3",
    },
  ];

  return (
    <div className="restaurant-menu-container">
      {/* 상단 제목 + 등록 버튼 */}
      <div className="menu-header-row">
        <h3 className="menu-title">メニュー一覧</h3>
        {isOwner && (
          <button className="menu-add-btn" onClick={() => setIsModalOpen(true)}>
            ➕ メニューを追加
          </button>
        )}
      </div>

      {/* 메뉴 카드 리스트 */}
      <div className="menu-list-grid">
        {mockMenus.map((menu) => (
          <div key={menu.id} className="menu-card">
            {/* ✅ 이미지가 없어도 자리 유지 */}
            <div className="menu-image-wrap">
              <img
                src={
                  menu.imageUrl ||
                  "https://via.placeholder.com/400x250?text=No+Image"
                }
                alt={menu.name}
                className="menu-image"
              />
            </div>

            <div className="menu-info">
              <h4 className="menu-name">{menu.name}</h4>
              <p className="menu-desc">{menu.description}</p>
              <p className="menu-price">¥{menu.price.toLocaleString()}</p>

              {isOwner && (
                <div className="menu-actions">
                  <button className="edit-btn" onClick={() => handleEdit(menu)}>
                    ✏️ 編集
                  </button>
                  <button className="delete-btn">🗑️ 削除</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ 메뉴 등록/수정 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCancel}>
              ✕
            </button>

            <h3 className="modal-title">
              {editingMenu ? "メニューを編集" : "新しいメニューを追加"}
            </h3>

            <MenuForm
              restaurantId={restaurantId}
              menu={editingMenu || undefined}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
