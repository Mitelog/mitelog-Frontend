import React, { useEffect, useMemo, useState } from "react";
import "/src/styles/restaurantReview.css";

interface RestaurantCardData {
  id: number;
  name: string;
  image?: string;
  area?: string;
  address?: string;
  averageRating?: number;
  averagePrice?: string;
  openHours?: string[];
}

const PAGE_SIZE = 5;

const UserBookmarks: React.FC = () => {
  const [items, setItems] = useState<RestaurantCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoading(true);

    // ✅ 더미 북마크 데이터
    const dummy = [
      {
        id: 101,
        name: "토리이자카야",
        image:
          "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&q=80",
        area: "서울 마포구",
        address: "서울 마포구 양화로 12",
        averageRating: 4.7,
        averagePrice: "¥2,000〜¥3,000",
        openHours: ["17:00〜23:00"],
      },
      {
        id: 102,
        name: "카츠야",
        image:
          "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&q=80",
        area: "부산 해운대",
        address: "부산 해운대구 달맞이길 77",
        averageRating: 4.5,
        averagePrice: "¥1,500〜¥2,500",
        openHours: ["11:30〜21:00"],
      },
    ];

    setTimeout(() => {
      setItems(dummy);
      setLoading(false);
    }, 300);
  }, []);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / PAGE_SIZE)),
    [items.length]
  );

  const visible = useMemo(() => {
    const start = page * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  if (loading)
    return <p className="loading-text">ブックマークを読み込み中...</p>;

  return (
    <div className="restaurant-review-section">
      <div className="review-header-row">
        <h3>ブックマーク</h3>
      </div>

      {items.length === 0 ? (
        <p className="no-review-text">まだブックマークがありません。</p>
      ) : (
        <>
          <div className="bookmark-list">
            {visible.map((r) => (
              <a
                key={r.id}
                href={`/restaurants/${r.id}`}
                className="bookmark-card"
              >
                <div className="bookmark-thumb">
                  <img src={r.image} alt={r.name} className="bookmark-img" />
                </div>
                <div className="bookmark-info">
                  <div className="bookmark-header">
                    <h4 className="bookmark-name">{r.name}</h4>
                    <span className="bookmark-rating">
                      ⭐ {r.averageRating}
                    </span>
                  </div>
                  <p className="bookmark-address">{r.area}</p>
                  <p className="bookmark-detail">
                    予算：{r.averagePrice}　営業時間：
                    {r.openHours?.join(" / ")}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserBookmarks;
