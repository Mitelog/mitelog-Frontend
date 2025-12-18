import React, { useEffect, useMemo, useState } from "react";
import axiosApi from "../../api/axiosApi"; // ✅ 너가 쓰던 인터셉터 axios
import MenuForm from "../menu/MenuForm";
import "/src/styles/restaurantMenu.css";

interface RestaurantMenuProps {
  restaurantId: number;
  ownerId: number;
}

export interface MenuItem {
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
  /** ✅ owner 판별 (localStorage 값은 string이라 number로 변환) */
  const loggedInUserId = useMemo(() => {
    const v = localStorage.getItem("memberId");
    return v ? Number(v) : null;
  }, []);
  const isOwner = loggedInUserId !== null && loggedInUserId === ownerId;

  /** ✅ 서버에서 받아온 메뉴 리스트 */
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** ✅ 모달/편집 상태 */
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /** ✅ 저장 성공 후 강제 새로고침 트리거 */
  const [refreshKey, setRefreshKey] = useState(0);

  /** ✅ 메뉴 조회: GET /api/menus/restaurant/{restaurantId} */
  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axiosApi.get<MenuItem[]>(
        `/menus/restaurant/${restaurantId}`
      );

      setMenus(res.data ?? []);
    } catch (e: any) {
      console.error("❌ 메뉴 조회 실패:", e);
      setError("メニューを読み込めませんでした。");
    } finally {
      setLoading(false);
    }
  };

  /** ✅ restaurantId or refreshKey 변경 시 재조회 */
  useEffect(() => {
    fetchMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId, refreshKey]);

  const handleEdit = (menu: MenuItem) => {
    setEditingMenu(menu);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    // ✅ MenuForm에서 등록/수정 성공하면 여기로 옴
    setEditingMenu(null);
    setIsModalOpen(false);

    // ✅ 목록 재조회 트리거
    setRefreshKey((prev) => prev + 1);
  };

  const handleCancel = () => {
    setEditingMenu(null);
    setIsModalOpen(false);
  };

  /** ✅ (선택) 삭제: 백엔드에 DELETE가 있어야 동작함 */
  const handleDelete = async (menuId: number) => {
    if (!confirm("このメニューを削除しますか？")) return;

    try {
      await axiosApi.delete(`/menus/${menuId}`);
      setRefreshKey((prev) => prev + 1);
    } catch (e) {
      console.error("❌ 메뉴 삭제 실패:", e);
      alert("削除に失敗しました。");
    }
  };

  return (
    <div className="restaurant-menu-container">
      {/* 상단 제목 + 등록 버튼 */}
      <div className="menu-header-row">
        <h3 className="menu-title">メニュー一覧</h3>
        {isOwner && (
          <button
            className="menu-add-btn"
            onClick={() => {
              setEditingMenu(null);
              setIsModalOpen(true);
            }}
          >
            ➕ メニューを追加
          </button>
        )}
      </div>

      {/* 상태 표시 */}
      {loading && <p style={{ padding: "8px 0" }}>Loading...</p>}
      {error && <p style={{ padding: "8px 0" }}>{error}</p>}
      {!loading && !error && menus.length === 0 && (
        <p style={{ padding: "8px 0" }}>メニューがありません。</p>
      )}

      {/* 메뉴 카드 리스트 */}
      <div className="menu-list-grid">
        {menus.map((menu) => (
          <div key={menu.id} className="menu-card">
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
              {menu.description && (
                <p className="menu-desc">{menu.description}</p>
              )}
              <p className="menu-price">¥{menu.price.toLocaleString()}</p>

              {isOwner && (
                <div className="menu-actions">
                  <button className="edit-btn" onClick={() => handleEdit(menu)}>
                    ✏️ 編集
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(menu.id)}
                  >
                    🗑️ 削除
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 메뉴 등록/수정 모달 */}
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
