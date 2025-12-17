import React, { useState } from "react";
import "/src/styles/filterSidebar.css";

/**
 * ✅ 백엔드 RestaurantSearchRequest와 "키 이름"을 1:1로 맞춘 타입
 * - region -> area
 * - details 중첩 제거 (query param은 평평하게 보내야 서버가 받기 쉬움)
 * - parking -> parkingArea
 * - unlimitedDrink -> unlimitDrink
 * - unlimitedFood -> unlimitFood
 */
export type RestaurantListFilters = {
  keyword: string;
  area: string;
  category: string;

  creditCard?: boolean;
  parkingArea?: boolean;
  privateRoom?: boolean;
  smoking?: boolean;
  unlimitDrink?: boolean;
  unlimitFood?: boolean;
};

interface FilterSidebarProps {
  /**
   * ✅ "부분 패치" 형태로 전달
   * - 리스트 페이지에서 setFilters(cur => ({...cur, ...patch})) 하기 좋음
   */
  onFilterChange: (patch: Partial<RestaurantListFilters>) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const [keyword, setKeyword] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState("");

  // ✅ 서버 DTO 필드명 그대로 유지
  const [details, setDetails] = useState({
    creditCard: false,
    parkingArea: false,
    privateRoom: false,
    smoking: false,
    unlimitDrink: false,
    unlimitFood: false,
  });

  const handleToggle = (key: keyof typeof details) => {
    setDetails((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /**
   * ✅ 적용 버튼
   * - 문자열 필터는 빈 값이면 보내지 않음(= 서버에서 null 처리와 동일)
   * - Boolean 필터는 true인 것만 보내는 게 정석(체크된 조건만 필터)
   */
  const handleApply = () => {
    const patch: Partial<RestaurantListFilters> = {
      keyword: keyword.trim(),
      area,
      category,
    };

    // ✅ 빈 문자열이면 서버에 보내지 않도록 undefined 처리
    if (!patch.keyword) delete patch.keyword;
    if (!patch.area) delete patch.area;
    if (!patch.category) delete patch.category;

    // ✅ true인 것만 필터 조건으로 보냄
    (Object.keys(details) as (keyof typeof details)[]).forEach((k) => {
      if (details[k]) {
        (patch as any)[k] = true;
      }
    });

    onFilterChange(patch);
  };

  /**
   * ✅ 리셋 버튼
   * - 리스트 쪽에서도 깔끔하게 초기화되도록 "명시적으로" 초기값 전달
   */
  const handleReset = () => {
    setKeyword("");
    setArea("");
    setCategory("");
    setDetails({
      creditCard: false,
      parkingArea: false,
      privateRoom: false,
      smoking: false,
      unlimitDrink: false,
      unlimitFood: false,
    });

    onFilterChange({
      keyword: "",
      area: "",
      category: "",

      // ✅ 체크 조건들도 해제 의도 전달
      creditCard: undefined,
      parkingArea: undefined,
      privateRoom: undefined,
      smoking: undefined,
      unlimitDrink: undefined,
      unlimitFood: undefined,
    });
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
          <select value={area} onChange={(e) => setArea(e.target.value)}>
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

      {/* 💡 편의시설 */}
      <div className="filter-card">
        <label className="filter-subtitle">こだわり条件</label>
        <div className="facility-grid">
          {[
            { key: "creditCard", label: "クレジットカード可" },
            { key: "parkingArea", label: "駐車場あり" },
            { key: "privateRoom", label: "個室あり" },
            { key: "smoking", label: "喫煙可" },
            { key: "unlimitDrink", label: "飲み放題あり" },
            { key: "unlimitFood", label: "食べ放題あり" },
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
