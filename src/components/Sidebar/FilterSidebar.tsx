import React, { useState } from "react";

interface FilterSidebarProps {
  // 필터 값이 변경될 때 상위 컴포넌트로 전달하는 함수
  onFilterChange: (filters: {
    keyword: string;
    region: string;
    category: string;
  }) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  // 🔹 상태 정의
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");

  // 🔹 “검색 적용” 버튼 클릭 시 상위로 필터 전달
  const handleApply = () => {
    // 빈 문자열은 params에서 제거
    const cleaned = Object.fromEntries(
      Object.entries({ keyword, region, category }).filter(([_, v]) => v !== "")
    );

    onFilterChange(cleaned);
  };

  return (
    <aside className="filter-sidebar">
      <h2 className="filter-title">検索フィルター</h2>

      {/* 🔍 키워드 검색 */}
      <div className="filter-group">
        <label>キーワード検索</label>
        <input
          type="text"
          placeholder="店名や料理名で検索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {/* 📍 지역 선택 */}
      <div className="filter-group">
        <label>地域</label>
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">すべての地域</option>
          <option value="東京都">東京都</option>
          <option value="神奈川県">神奈川県</option>
          <option value="千葉県">千葉県</option>
          <option value="埼玉県">埼玉県</option>
          <option value="大阪府">大阪府</option>
          <option value="京都府">京都府</option>
          <option value="愛知県">愛知県</option>
          <option value="兵庫県">兵庫県</option>
          <option value="福岡県">福岡県</option>
          <option value="北海道">北海道</option>
          <option value="沖縄県">沖縄県</option>
        </select>
      </div>

      {/* 🍣 카테고리 선택 */}
      <div className="filter-group">
        <label>カテゴリ</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">すべてのカテゴリ</option>
          <option value="和食">和食</option>
          <option value="寿司">寿司</option>
          <option value="ラーメン">ラーメン</option>
          <option value="焼肉">焼肉</option>
          <option value="イタリアン">イタリアン</option>
          <option value="フレンチ">フレンチ</option>
          <option value="カフェ">カフェ</option>
          <option value="バー">バー</option>
        </select>
      </div>

      <button className="apply-btn" onClick={handleApply}>
        🔎 検索を適用
      </button>
    </aside>
  );
};

export default FilterSidebar;
