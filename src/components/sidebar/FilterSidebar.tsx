import React, { useState } from "react";
import "../../styles/filterSidebar.css";

interface FilterSidebarProps {
  onFilterChange: (filters: {
    keyword: string;
    region: string;
    category: string;
    details?: {
      creditCard?: boolean;
      parking?: boolean;
      privateRoom?: boolean;
      smoking?: boolean;
      unlimitedDrink?: boolean;
      unlimitedFood?: boolean;
    };
  }) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState({
    creditCard: false,
    parking: false,
    privateRoom: false,
    smoking: false,
    unlimitedDrink: false,
    unlimitedFood: false,
  });

  const handleToggle = (key: keyof typeof details) => {
    setDetails((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApply = () => {
    const cleaned = Object.fromEntries(
      Object.entries({ keyword, region, category }).filter(([_, v]) => v !== "")
    );
    onFilterChange({
      ...cleaned,
      details,
    });
  };

  const handleReset = () => {
    setKeyword("");
    setRegion("");
    setCategory("");
    setDetails({
      creditCard: false,
      parking: false,
      privateRoom: false,
      smoking: false,
      unlimitedDrink: false,
      unlimitedFood: false,
    });
    onFilterChange({ keyword: "", region: "", category: "" });
  };

  return (
    <aside className="filter-sidebar">
      <h2 className="filter-title">検索フィルター</h2>

      {/* 🔸 기본 검색 카드 */}
      <div className="filter-card">
        <div className="filter-group">
          <label>キーワード検索</label>
          <input
            type="text"
            placeholder="店名や料理名で検索"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>地域</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">すべての地域</option>
            <option value="東京都">東京都</option>
            <option value="大阪府">大阪府</option>
            <option value="福岡県">福岡県</option>
            <option value="北海道">北海道</option>
            <option value="京都府">京都府</option>
          </select>
        </div>

        <div className="filter-group">
          <label>カテゴリ</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">すべてのカテゴリ</option>
            <option value="和食">和食</option>
            <option value="寿司">寿司</option>
            <option value="ラーメン">ラーメン</option>
            <option value="焼肉">焼肉</option>
            <option value="カフェ">カフェ</option>
            <option value="バー">バー</option>
          </select>
        </div>
      </div>

      {/* 💡 편의시설 (Grid 기반 카드형 버튼) */}
      <div className="filter-card">
        <label className="filter-subtitle">こだわり条件</label>
        <div className="facility-grid">
          {[
            { key: "creditCard", label: "クレジットカード可" },
            { key: "parking", label: "駐車場あり" },
            { key: "privateRoom", label: "個室あり" },
            { key: "smoking", label: "喫煙可" },
            { key: "unlimitedDrink", label: "飲み放題あり" },
            { key: "unlimitedFood", label: "食べ放題あり" },
          ].map((item) => (
            <div
              key={item.key}
              className={`facility-item ${
                details[item.key as keyof typeof details] ? "active" : ""
              }`}
              onClick={() => handleToggle(item.key as keyof typeof details)}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* 버튼 */}
      <div className="filter-buttons">
        <button className="apply-btn" onClick={handleApply}>
          🔎 検索を適用
        </button>
        <button className="reset-btn" onClick={handleReset}>
          リセット
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
