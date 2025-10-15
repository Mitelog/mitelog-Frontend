import React, { useState } from "react";
import MenuList from "../menu/MenuList";
import MenuForm from "../menu/MenuForm";

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

  const handleEdit = (menu: any) => setEditingMenu(menu);
  const handleSuccess = () => {
    setEditingMenu(null);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="restaurant-menu-section">
      <MenuList
        key={refreshKey}
        restaurantId={restaurantId}
        isOwner={!!isOwner}
        onEdit={handleEdit}
      />

      {isOwner && (
        <div className="menu-form-container">
          <MenuForm
            restaurantId={restaurantId}
            menu={editingMenu || undefined}
            onSuccess={handleSuccess}
            onCancel={() => setEditingMenu(null)}
          />
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
