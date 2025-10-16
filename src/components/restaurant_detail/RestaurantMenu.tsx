import React, { useState } from "react";
import MenuList from "../menu/MenuList";
import MenuForm from "../menu/MenuForm";
import "./restaurantMenu.css";

interface RestaurantMenuProps {
  restaurantId: number;
  ownerId: number;
}

const RestaurantMenu: React.FC<RestaurantMenuProps> = ({
  restaurantId,
  ownerId,
}) => {
  const loggedInUserId = localStorage.getItem("memberId");
  const isOwner = loggedInUserId && Number(loggedInUserId) === ownerId;

  const [editingMenu, setEditingMenu] = useState<any | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ 모달 상태

  const handleEdit = (menu: any) => {
    setEditingMenu(menu);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setEditingMenu(null);
    setIsModalOpen(false);
    setRefreshKey((prev) => prev + 1); // ✅ 새로고침
  };

  const handleCancel = () => {
    setEditingMenu(null);
    setIsModalOpen(false);
  };

  return (
    <div className="restaurant-menu-container">
      <div className="menu-header-row">
        <h3 className="menu-title">🍽️ メニュー一覧</h3>

        {/* ✅ 사장만 메뉴 등록 버튼 보이기 */}
        {isOwner && (
          <button className="menu-add-btn" onClick={() => setIsModalOpen(true)}>
            メニューを追加
          </button>
        )}
      </div>

      {/* ✅ 메뉴 리스트 */}
      <MenuList
        key={refreshKey}
        restaurantId={restaurantId}
        isOwner={!!isOwner}
        onEdit={handleEdit}
      />

      {/* ✅ 모달 (등록/수정용) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않게
          >
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
