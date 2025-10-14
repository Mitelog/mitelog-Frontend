import React from "react";
import "../../styles/userpage.css";

const dummyBookmarks = [
  { id: 1, name: "焼肉 牛王", category: "焼肉", address: "東京 渋谷区" },
  { id: 2, name: "カフェ カミーユ", category: "カフェ", address: "大阪 北区" },
];

const MyBookmarks: React.FC = () => {
  return (
    <div className="bookmark-list">
      <h3>ブックマークしたお店</h3>
      {dummyBookmarks.map((store) => (
        <div key={store.id} className="bookmark-card">
          <h4>{store.name}</h4>
          <p>
            <strong>{store.category}</strong> | {store.address}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyBookmarks;
