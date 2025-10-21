import React, { useEffect, useState } from "react";
import axiosApi from "../../api/axiosApi";
import "../restaurant_detail/restaurantReview.css";

type RestaurantCardData = {
  id: number;
  name: string;
  image?: string;
  area?: string;
  address?: string;
  averageRating?: number;
  categoryNames?: string[];
  reservationAvailable?: boolean;
  openHours?: string[];
  averagePrice?: string;
  description?: string;
};

const MyBookmarks: React.FC = () => {
  const [items, setItems] = useState<RestaurantCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosApi
      .get("/bookmarks/me")
      .then((res) => {
        const list = Array.isArray(res.data?.data)
          ? res.data.data
          : res.data ?? [];
        setItems(list);
      })
      .catch((err) => {
        console.error("ブックマーク取得失敗:", err);
      })
      .finally(() => setLoading(false));
  }, []);

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
        <div className="bookmark-list">
          {items.map((r) => {
            const ratingText =
              typeof r.averageRating === "number"
                ? `⭐ ${r.averageRating.toFixed(1)}`
                : "⭐ -";

            const addressLine = r.area || r.address || "住所情報なし";
            const budget = r.averagePrice || "¥3,000〜¥5,000";
            const hours = r.openHours?.length
              ? r.openHours.join(" / ")
              : "月〜金 11:30〜22:00 / 土日祝 12:00〜21:30";

            return (
              <a
                key={r.id}
                href={`/restaurants/${r.id}`}
                className="bookmark-card"
              >
                <div className="bookmark-thumb">
                  <img
                    src={
                      r.image ||
                      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&q=60&auto=format"
                    }
                    alt={r.name}
                    className="bookmark-img"
                  />
                </div>

                <div className="bookmark-info">
                  <div className="bookmark-header">
                    <h4 className="bookmark-name">{r.name}</h4>
                    <span className="bookmark-rating">{ratingText}</span>
                  </div>
                  <p className="bookmark-address">{addressLine}</p>
                  <p className="bookmark-detail">
                    予算：{budget}　営業時間：{hours}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookmarks;
